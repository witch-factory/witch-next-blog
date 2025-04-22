import { container } from './resume-style.css';

function ResumeLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <div className={container}>
      {children}
    </div>
  );
}
export default ResumeLayout;
