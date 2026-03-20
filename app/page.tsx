import {redirect} from 'next/navigation';

// Page de redirection vers la locale par défaut
export default function RootPage() {
  redirect('/kh');
}