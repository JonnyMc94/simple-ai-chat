import { updateUserSettings } from 'utils/sqliteUtils.js';
import { authenticate } from 'utils/authUtils.js';

export default async function (req, res) {
  // Check if the method is POST.
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  
  // Authentication
  const authResult = authenticate(req);
  if (!authResult.success) {
    return res.status(401).json({ error: authResult.error });
  }
  const { id, username } = authResult.user;

  // Input and validation
  const { key, value } = req.body;
  if (!key || !value) {
    return res.status(400).json({ error: 'Username and settings are required.' });
  }

  try {
    const wasSuccessful = await updateUserSettings(username, key, value);
    if (wasSuccessful) {
      return res.status(200).json({ success: true, message: "Settings updated successfully" });
    } else {
      return res.status(400).json({ error: 'Failed to update settings or user not found.' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Error occurred while updating the user settings.' });
  }
}
