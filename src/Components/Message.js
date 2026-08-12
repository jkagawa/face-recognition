const Message = ({ message, isBusy }) => {
    if (!isBusy && !message) return null;

    const text = isBusy ? 'Detecting faces...' : message.text;
    const tone = isBusy || message.tone === 'info' ? 'text-white/50' : 'text-rose-300';

    return (
        <div className="mx-4">
            <p className={`text-sm font-light ${tone}`}>{text}</p>
        </div>
    );
}

export default Message;
