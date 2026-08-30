import { nowPastNext } from "@/lib/content/about";

export function NowPastNext() {
  return (
    <div className="npn">
      {nowPastNext.map((col) => (
        <div key={col.title}>
          <h3>{col.title}</h3>
          <ul>
            {col.items.map((item) => (
              <li key={item.marker + item.text} className={item.hi ? "hi" : undefined}>
                <b>{item.marker}</b>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
