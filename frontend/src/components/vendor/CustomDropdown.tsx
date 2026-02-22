import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface DropdownOption<T extends string = string> {
    value: T;
    label: string;
}

interface Props<T extends string> {
    options: DropdownOption<T>[];
    value: T;
    onChange: (v: T) => void;
    minWidth?: string;
    placeholder?: string;
}

const CustomDropdown = <T extends string>({ options, value, onChange, minWidth = '160px', placeholder = 'Select Option' }: Props<T>) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Keyboard: Escape closes
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, []);

    const selected = options.find(o => o.value === value);

    return (
        <div ref={ref} className="cd-root" style={{ minWidth, position: 'relative' }}>
            {/* ── Trigger ── */}
            <button
                type="button"
                className={`cd-trigger${open ? ' open' : ''}`}
                onClick={() => setOpen(p => !p)}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span className="cd-label" style={{ color: selected ? 'var(--vl-text)' : 'var(--vl-hint)' }}>
                    {selected?.label ?? placeholder}
                </span>
                <ChevronDown size={13} className={`cd-chevron${open ? ' open' : ''}`} />
            </button>

            {/* ── Panel ── */}
            {open && (
                <ul
                    role="listbox"
                    className="cd-panel"
                    style={{ minWidth }}
                >
                    {options.map(opt => (
                        <li
                            key={opt.value}
                            role="option"
                            aria-selected={opt.value === value}
                            className={`cd-option${opt.value === value ? ' selected' : ''}`}
                            onClick={() => { onChange(opt.value); setOpen(false); }}
                            onKeyDown={e => { if (e.key === 'Enter') { onChange(opt.value); setOpen(false); } }}
                            tabIndex={0}
                        >
                            {opt.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CustomDropdown;
