import { BookOpen } from 'lucide-react';
import PlaceholderModule from '../common/PlaceholderModule';

export default function NotebooksModule() {
  return (
    <PlaceholderModule
      icon={BookOpen}
      title="Notebooks"
      description="Interactive Python/SQL exploratory data analysis. This area is a placeholder in the current demo — the Dashboard Configuration Studio (under Configuration) is the only fully implemented page."
    />
  );
}
