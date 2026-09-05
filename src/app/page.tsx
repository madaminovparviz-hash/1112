import ChurchApp from "@/components/church/ChurchApp";

/**
 * Single public route of the site. The whole experience — public pages
 * (Home, About, Schedule, Lessons, Media, Prayer, Contacts), the page
 * builder pages and the admin panel — is rendered inside <ChurchApp />
 * with hash-based navigation (#/, #/about, …, #/admin).
 */
export default function Home() {
  return <ChurchApp />;
}
