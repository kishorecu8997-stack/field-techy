import type { Section } from "../type";


const ContentPage = ({ content }: { content: Section[] }) => {
  return (
    <div className=" p-6 w-full space-y-8 text-gray-700">
      {content.map((section, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900">
            {section.title}
          </h2>

          {/* Render paragraph content if present */}
          {section.content && (
            <p className="mb-4 leading-relaxed whitespace-pre-line">
              {section.content}
            </p>
          )}

          {/* Render bullet list if items exist */}
          {section.items && (
            <ul className="space-y-3">
              {section.items.map((item, i) => (
                <li key={i} className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 bg-neutral-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    {item.title && <strong className="">{item.title}:</strong>}{" "}
                    {item.description}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default ContentPage;
