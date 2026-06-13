import { useState } from 'react';
import { Copy, Link as LinkIcon, CheckCircle2 } from 'lucide-react';

export default function Admin() {
  const [prefix, setPrefix] = useState('Mr.');
  const [guestName, setGuestName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  const prefixes = [
    'Mr.',
    'Mrs.',
    'Miss.',
    'Mr. & Mrs.',
    'Family of',
    'Dear',
  ];

  const handleGenerate = () => {
    if (!guestName.trim()) return;
    const fullName = `${prefix} ${guestName.trim()}`;
    const url = new URL(window.location.origin);
    url.searchParams.set('guest', fullName);
    setGeneratedLink(url.toString());
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!generatedLink) return;
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 font-sans text-zinc-800">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-zinc-100">
        <h1 className="text-3xl font-serif font-bold text-umber mb-2 text-center">Admin Panel</h1>
        <p className="text-sm text-zinc-500 text-center mb-8 uppercase tracking-widest">Generate Guest Links</p>

        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Prefix</label>
            <select
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all text-zinc-700"
            >
              {prefixes.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Guest Name</label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all text-zinc-700"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!guestName.trim()}
            className="w-full flex items-center justify-center gap-2 bg-umber hover:bg-umber/90 text-white font-bold uppercase tracking-widest text-xs py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            <LinkIcon size={16} />
            Create Link
          </button>

          {generatedLink && (
            <div className="mt-8 p-4 bg-sage/10 border border-sage/20 rounded-xl space-y-3 animate-in fade-in slide-in-from-bottom-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-sage">Generated Link</p>
              <div className="p-3 bg-white border border-sage/10 rounded-lg break-all text-xs text-zinc-600 font-mono select-all">
                {generatedLink}
              </div>
              <button
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 bg-sage hover:bg-sage/90 text-white font-bold uppercase tracking-widest text-xs py-3 rounded-lg transition-colors"
              >
                {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
