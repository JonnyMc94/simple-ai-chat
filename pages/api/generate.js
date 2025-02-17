import OpenAI from "openai";
import chalk from 'chalk';
import { generateMessages } from "utils/promptUtils";
import { logadd } from "utils/logUtils.js";
import { getMaxTokens } from "utils/tokenUtils";

// OpenAI
const openai = new OpenAI();

// configurations
const model = process.env.MODEL ? process.env.MODEL : "";
const role_content_system = process.env.ROLE_CONTENT_SYSTEM ? process.env.ROLE_CONTENT_SYSTEM : "";
const temperature = process.env.TEMPERATURE ? Number(process.env.TEMPERATURE) : 0.7;  // default is 0.7
const top_p = process.env.TOP_P ? Number(process.env.TOP_P) : 1;                      // default is 1
const prompt_prefix = process.env.PROMPT_PREFIX ? process.env.PROMPT_PREFIX : "";
const prompt_suffix = process.env.PROMPT_SUFFIX ? process.env.PROMPT_SUFFIX : "";
const max_tokens = process.env.MAX_TOKENS ? Number(process.env.MAX_TOKENS) : getMaxTokens(model);
const dict_search = process.env.DICT_SEARCH == "true" ? true : false;
const use_function_calling = process.env.USE_FUNCTION_CALLING == "true" ? true : false;
const use_node_ai = process.env.USE_NODE_AI == "true" ? true : false;
const force_node_ai_query = process.env.FORCE_NODE_AI_QUERY == "true" ? true : false;
const use_vector = process.env.USE_VECTOR == "true" ? true : false;
const force_vector_query = process.env.FORCE_VECTOR_QUERY == "true" ? true : false;

export default async function (req, res) {
  const queryId = req.body.query_id || "";
  const role = req.body.role || "";
  const use_stats = req.body.use_stats || false;
  const use_location = req.body.use_location || false;
  const location = req.body.location || "";

  // Query ID, same as session ID
  const verifyResult = verifySessionId(queryId);
  if (!verifyResult.success) {
    res.status(400).send(verifyResult.message);
    return;
  }

  // Input
  let input = req.body.user_input || "";
  if (input.trim().length === 0) return;
  input = prompt_prefix + input + prompt_suffix;
  console.log(chalk.yellowBright("\nInput (query_id = " + queryId + "):"));
  console.log(input + "\n");

  // Configuration info
  console.log("--- configuration info ---\n" 
  + "model: " + model + "\n"
  + "temperature: " + temperature + "\n"
  + "top_p: " + top_p + "\n"
  + "role_content_system (chat): " + role_content_system + "\n"
  + "prompt_prefix: " + prompt_prefix + "\n"
  + "prompt_suffix: " + prompt_suffix + "\n"
  + "max_tokens: " + max_tokens + "\n"
  + "dict_search: " + dict_search + "\n"
  + "use_function_calling: " + use_function_calling + "\n"
  + "use_node_ai: " + use_node_ai + "\n"
  + "force_node_ai_query: " + force_node_ai_query + "\n"
  + "use_vector: " + use_vector + "\n"
  + "force_vector_query: " + force_vector_query + "\n"
  + "use_lcation: " + use_location + "\n"
  + "location: " + location + "\n"
  + "role: " + role + "\n");

  try {
    let result_text = "";
    let score = 0;
    let token_ct = 0;

    const generateMessagesResult = await generateMessages(input, null, queryId, role);  // image_url not supported yet
    score = generateMessagesResult.score;
    token_ct = generateMessagesResult.token_ct;

    // endpoint: /v1/chat/completions
    let chatCompletion;
    chatCompletion = await openai.chat.completions.create({
      model: process.env.MODEL,
      messages: generateMessagesResult.messages,
      temperature: temperature,
      top_p: top_p,
      max_tokens: max_tokens,
    });

    // Get result
    const choices = chatCompletion.choices;
    if (!choices || choices.length === 0) {
      console.log(chalk.redBright("Error (query_id = " + queryId + "):"));
      console.error("No choice\n");
      result_text = "Silent...";
    } else {
      result_text = choices[0].message.content;
    }

    // Output the result
    if (result_text.trim().length === 0) result_text = "(null)";
    console.log(chalk.blueBright("Output (query_id = "+ queryId + "):"));
    console.log(result_text + "\n");
    logadd(queryId, "Q=" + input + " A=" + result_text, req);

    res.status(200).json({
      result: {
        text : result_text,
        stats: {
          temperature: process.env.TEMPERATURE,
          top_p: process.env.TOP_P,
          score: score,
          token_ct: token_ct,
          func: false
        },
        info: {
          model: process.env.MODEL,
        }
      },
    });
  } catch (error) {
    console.log("Error:");
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}
