/**
 * Detects whether a given video URL is a YouTube link or an S3 object key.
 * @param {string} url - The video URL or S3 Key
 * @returns {"youtube" | "s3"}
 */
export const detectVideoType = (url) => {
  if (!url) return "s3";
  // Strict matching to prevent misrouting random domains to YouTube player
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return "youtube";
  }
  return "s3";
};

/**
 * Extracts the YouTube video ID from various YouTube URL formats.
 * @param {string} url - The YouTube URL
 * @returns {string} The extracted Video ID or empty string
 */
export const extractYouTubeId = (url) => {
  if (!url) return "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : "";
};
