import type { ReactNode } from 'react';

type Network = {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
};

function buildNetworks(url: string, title: string): Network[] {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  return [
    {
      id: 'facebook',
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
          <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.2c0-.9.3-1.5 1.6-1.5H17V5.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2V11H8v3h2.4v7h3.1z" />
        </svg>
      )
    },
    {
      id: 'x',
      label: 'X (Twitter)',
      href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
          <path d="M17.5 3h3l-6.6 7.6L21.7 21H15.6l-5.1-6.7L4.6 21H1.6l7.1-8.1L1.6 3h6.2l4.6 6.1L17.5 3zm-1 16.3h1.7L7.6 4.6H5.8l10.7 14.7z" />
        </svg>
      )
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
          <path d="M4.98 3.5a2.5 2.5 0 1 1-.02 5.01A2.5 2.5 0 0 1 4.98 3.5zM3 9h4v12H3V9zm7 0h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H10V9z" />
        </svg>
      )
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      href: `https://wa.me/?text=${t}%20${u}`,
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
          <path d="M20.5 3.5A10.5 10.5 0 0 0 3.7 17.4L2 22l4.7-1.2A10.5 10.5 0 1 0 20.5 3.5zM12 20.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-2.8.7.8-2.7-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.7-6.2c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.7.8-.8 1-.2.1-.3.2-.5 0-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.6-1.5-1.8-.2-.3 0-.4.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5s-.6-1.5-.8-2c-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.4-.3.2-1 .9-1 2.3 0 1.4 1 2.7 1.2 2.9.1.2 2 3.1 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.4z" />
        </svg>
      )
    },
    {
      id: 'email',
      label: 'E-mail',
      href: `mailto:?subject=${t}&body=${u}`,
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
          <path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm0 2v.5l8 5 8-5V7H4zm0 2.4V18h16V9.4l-8 5-8-5z" />
        </svg>
      )
    }
  ];
}

export function ShareLinks({
  url,
  title,
  intro = 'Partager ce produit'
}: {
  url: string;
  title: string;
  intro?: string;
}) {
  const networks = buildNetworks(url, title);
  return (
    <section
      aria-label={intro}
      className="mt-6 rounded-2xl border border-neutral-200/80 bg-white p-4"
    >
      <h2 className="text-sm font-medium text-neutral-700">{intro}</h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {networks.map((n) => (
          <li key={n.id}>
            <a
              href={n.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Partager sur ${n.label}`}
              title={`Partager sur ${n.label}`}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-3.5 py-2 text-xs font-medium text-neutral-700 transition hover:border-[var(--brand)] hover:bg-[var(--brand-light)] hover:text-[var(--brand-dark)]"
            >
              {n.icon}
              <span>{n.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
