import { motion } from 'framer-motion';
import { Radar } from 'lucide-react';

export function MonitoringSection() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-4 sm:px-8 text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
        className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-twin-blue/20 via-twin-teal/20 to-twin-purple/20"
      >
        <Radar size={28} className="text-twin-blue" />
      </motion.div>
      <h2 className="gradient-text text-xl font-semibold">Monitoring is coming soon</h2>
      <p className="max-w-sm text-sm text-(--text-muted)">
        Real-time system health, alerting and anomaly detection for every live pipeline — landing shortly.
      </p>
    </div>
  );
}
