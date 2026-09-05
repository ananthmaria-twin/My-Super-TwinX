import { GitBranch } from 'lucide-react';
import PlaceholderModule from '../common/PlaceholderModule';

export default function PipelinesModule() {
  return (
    <PlaceholderModule
      icon={GitBranch}
      title="Pipelines"
      description="Workflow DAGs and orchestration. This area is a placeholder in the current demo — the Dashboard Configuration Studio (under Configuration) is the only fully implemented page."
    />
  );
}
