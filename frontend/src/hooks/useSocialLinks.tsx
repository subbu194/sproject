import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { FaWhatsapp, FaInstagram, FaLinkedin, FaFacebook } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { Mail } from 'lucide-react';

export interface SocialLinksData {
  whatsapp?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  email?: string;
}

export const formatUrl = (url?: string) => {
  if (!url) return undefined;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:')) return url;
  return `https://${url}`;
};

export default function useSocialLinks() {
  const [social, setSocial] = useState<SocialLinksData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get('/connect')
      .then((res) => setSocial(res.data?.data || res.data || {}))
      .catch(() => setSocial({}))
      .finally(() => setLoading(false));
  }, []);

  const socialButtons = [
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      icon: <FaWhatsapp className="h-5 w-5" />,
      url: formatUrl(social.whatsapp),
      hoverClass: 'hover:border-green-400 hover:bg-green-500 hover:text-white',
    },
    {
      key: 'facebook',
      label: 'Facebook',
      icon: <FaFacebook className="h-5 w-5" />,
      url: formatUrl(social.facebook),
      hoverClass: 'hover:border-blue-400 hover:bg-blue-600 hover:text-white',
    },
    {
      key: 'instagram',
      label: 'Instagram',
      icon: <FaInstagram className="h-5 w-5" />,
      url: formatUrl(social.instagram),
      hoverClass: 'hover:border-pink-400 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white',
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      icon: <FaLinkedin className="h-5 w-5" />,
      url: formatUrl(social.linkedin),
      hoverClass: 'hover:border-blue-400 hover:bg-blue-600 hover:text-white',
    },
    {
      key: 'twitter',
      label: 'X (Twitter)',
      icon: <FaXTwitter className="h-5 w-5" />,
      url: formatUrl(social.twitter),
      hoverClass: 'hover:border-neutral-400 hover:bg-neutral-900 hover:text-white',
    },
    {
      key: 'email',
      label: 'Email',
      icon: <Mail className="h-5 w-5" />,
      url: social.email ? `mailto:${social.email}` : undefined,
      hoverClass: 'hover:border-[var(--gold)] hover:bg-[var(--gold)] hover:text-white',
    },
  ].filter((s) => s.url);

  return { social, loading, socialButtons };
}
