import { useRef, useEffect } from 'react';

import { ADDON_ID } from '../constants';

export interface IRefs {
    document: null | HTMLDocument,
    style: null | HTMLStyleElement
}

export const useInjectStyle = (args: Record<string, string>) => {
    const refs = useRef<IRefs>({
        document: null,
        style   : null
    });

    useEffect(() => {
        const $iframe = document.getElementById('storybook-preview-iframe') as HTMLIFrameElement | null;

        refs.current.document = $iframe?.contentWindow?.document || document;
    });

    useEffect(() => {
        if(refs.current.document) {
            refs.current.style = refs.current.document.getElementById(ADDON_ID) as HTMLStyleElement;

            if(!refs.current.style) {
                const $style = refs.current.document.createElement('style');

                $style.id = ADDON_ID;
                refs.current.style = refs.current.document.head.appendChild($style);
            }
        }
    }, [refs.current.document]);

    useEffect(() => {
        if(refs.current.style) {
            const entries = Object.entries(args);

            refs.current.style.textContent = entries.reduce((prev, [key, value]) => {
                const [selector, prop, media] = key.split('/');
                const rule = `${selector} { ${prop}: ${value}; }\n`;

                return prev + (media ? `@media ${media} {\n  ${rule}}\n` : rule);
            }, '');
        }
    }, [args]);
};
