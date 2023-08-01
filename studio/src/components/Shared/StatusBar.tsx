import React from 'react';

import { useLog, useProcessing } from '@elements/GlobalContext';

import chicken1 from '@assets/Chicken_Run.gif';
import chicken3 from '@assets/Chicken_Strut.gif';

const messages = [
    'Processing your data',
    'This may take a while depending on the size of your model',
    'Thank you for your patience',
    'Please do not close this window',
];

const chickens = [chicken1, chicken3];

export function StatusBar() {
    const [processing] = useProcessing();
    const [message, setMessage] = React.useState(messages[0]);
    const [chicken, setChicken] = React.useState(chickens[0]);
    const [log] = useLog();
    const [status, setStatus] = React.useState(log[log.length - 1]);
    let timerRef = React.useRef<NodeJS.Timeout>();

    React.useEffect(() => {
        setStatus(log[log.length - 1]);
        if (processing) {
            if (timerRef.current) clearTimeout(timerRef.current);
        } else {
            timerRef.current = setTimeout(() => {
                clearTimeout(timerRef.current);
                setStatus('Ready');
            }, 10000);
        }
    }, [log, processing]);

    React.useEffect(() => {
        if (processing) {
            let i = 0;
            const interval = setInterval(() => {
                i++;
                setMessage(messages[i % messages.length]);
                setChicken(chickens[i % chickens.length]);
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [processing]);

    return (
        <div className="px-4 border-t mc-border text-neutral-500 dark:bg-neutral-800 flex flex-row items-center justify-between">
            <div className="flex flex-row items-center justify-center">
                {processing && <div>Working</div>}
                {processing && <img src={chicken} className="w-6 h-6 mx-2" />}
                <div>{status}</div>
            </div>
            {processing && (
                <div className="flex flex-row items-center justify-center">
                    <div>{message}</div>
                </div>
            )}
        </div>
    );
}