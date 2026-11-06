import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <><a className="skip-link" href="#main-content">Preskoči na sadržaj</a><SiteHeader /><main id="main-content">{children}</main><SiteFooter /></>;
}
