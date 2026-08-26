export default function Logo({ size = 48, className = "" }) {
  const navy = "#0D2F6F";
  const red = "#E30613";
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className}
      role="img" aria-label="ProPacking — Insumos para embalaje">
      <defs>
        <path id="arcTop" d="M 30 100 A 70 70 0 0 1 170 100" fill="none" />
        <path id="arcBottom" d="M 168 100 A 68 68 0 0 1 32 100" fill="none" />
      </defs>
      <text fill={navy} fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="26" letterSpacing="2">
        <textPath href="#arcTop" startOffset="50%" textAnchor="middle">PROPACKING</textPath>
      </text>
      <text fill={navy} fontFamily="Poppins, sans-serif" fontWeight="600" fontSize="13" letterSpacing="1.5">
        <textPath href="#arcBottom" startOffset="50%" textAnchor="middle">INSUMOS PARA EMBALAJE</textPath>
      </text>
      <g>
        <rect x="74" y="72" width="18" height="60" fill={red} />
        <path d="M 92 72 h 12 a 22 22 0 0 1 0 44 h -12 z" fill={red} />
      </g>
    </svg>
  );
}
