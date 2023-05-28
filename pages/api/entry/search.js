import { simpleDictionarySearch } from '../utils/dictionaryUtils';

export default async function (req, res) {
  try {
    // Get the keyword
    const keyword = req.body.keyword || "";
    const dictionarySearchResult = await simpleDictionarySearch(keyword);

    // Output the result
    res.status(200).json({
      result: {
        entries : dictionarySearchResult.entries
      },
    });
  } catch (error) {
    console.error(error);

    // Consider adjusting the error handling logic for your use case
    res.status(500).json({
      error: {
        message: "An error occurred during your request.",
      },
    });
  }
}
