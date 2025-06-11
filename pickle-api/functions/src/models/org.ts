export interface Org {
  id?: string;
  name: string;
  description: string;
  owner: string; // Google UID of the owner
  logo: string;  // Imgur image URL
}