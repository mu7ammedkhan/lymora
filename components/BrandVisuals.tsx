import { LymoraMark } from "@/components/Logo";

export function IntelligenceVisual() {
  return (
    <div className="intelligence-visual" aria-label="Human expertise and artificial intelligence meeting inside a connected operating system" role="img">
      <div className="visual-orbit orbit-a" />
      <div className="visual-orbit orbit-b" />
      <div className="visual-axis axis-a" />
      <div className="visual-axis axis-b" />
      <div className="visual-core"><LymoraMark size={210} /></div>
      <span className="visual-node node-human"><i />Human judgement</span>
      <span className="visual-node node-ai"><i />AI intelligence</span>
      <span className="visual-node node-work"><i />Workflow design</span>
      <span className="visual-caption">A human-led AI operating system</span>
    </div>
  );
}

export function CapabilityDiagram() {
  const steps = [
    ["01", "Assess", "Find the valuable work"],
    ["02", "Design", "Build the workflow"],
    ["03", "Enable", "Equip the people"],
    ["04", "Deploy", "Operate and improve"]
  ];
  return (
    <div className="capability-diagram" aria-label="Lymora capability journey">
      <div className="diagram-line" />
      {steps.map(([number, title, text]) => (
        <div className="diagram-step" key={title}>
          <span>{number}</span><i /><div><strong>{title}</strong><small>{text}</small></div>
        </div>
      ))}
    </div>
  );
}

export function SignalArtwork({ variant = 0 }: { variant?: number }) {
  return (
    <div className={`signal-art signal-${variant % 3}`} aria-hidden="true">
      <span className="signal-ring ring-one" />
      <span className="signal-ring ring-two" />
      <span className="signal-line line-one" />
      <span className="signal-line line-two" />
      <LymoraMark size={82} />
    </div>
  );
}
