export function PanelTitle(props: { title: string }) {
    return (
        <div className="px-2 py-1 text-sm uppercase font-bold text-neutral-900">{props.title}</div>
    );
}