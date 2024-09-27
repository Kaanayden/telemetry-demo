import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';
import katex from 'katex';

interface RendererProps {
  content: string;
}

const ContentRenderer: React.FC<RendererProps> = ({ content }) => {
  const renderMath = (text: string) => {
    const mathRegex = /\((.*?)\)/g;
    let lastIndex = 0;
    const elements = [];

    let match;
    while ((match = mathRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        elements.push(text.slice(lastIndex, match.index));
      }

      const mathExpression = match[1];
      try {
        elements.push(
          <span
            key={match.index}
            dangerouslySetInnerHTML={{
              __html: katex.renderToString(mathExpression, {
                throwOnError: false,
                displayMode: false,
              }),
            }}
          />
        );
      } catch (error) {
        elements.push(`(${mathExpression})`);
      }

      lastIndex = mathRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      elements.push(text.slice(lastIndex));
    }

    return elements;
  };

  const renderContent = (node: any): React.ReactNode => {
    if (typeof node === 'string') {
      return renderMath(node);
    }
    if (Array.isArray(node)) {
      return node.map((item, index) => <React.Fragment key={index}>{renderContent(item)}</React.Fragment>);
    }
    if (React.isValidElement(node)) {
      return React.cloneElement(node, {
        children: renderContent(node.props.children),
      });
    }
    return null;
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              style={solarizedlight}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        p({ children }) {
          return <p>{renderContent(children)}</p>;
        },
        li({ children }) {
          return <li>{renderContent(children)}</li>;
        },
        h1({ children }) {
          return <h1>{renderContent(children)}</h1>;
        },
        h2({ children }) {
          return <h2>{renderContent(children)}</h2>;
        },
        h3({ children }) {
          return <h3>{renderContent(children)}</h3>;
        },
        h4({ children }) {
          return <h4>{renderContent(children)}</h4>;
        },
        h5({ children }) {
          return <h5>{renderContent(children)}</h5>;
        },
        h6({ children }) {
          return <h6>{renderContent(children)}</h6>;
        },
        table({ children }) {
          return (
            <table className="border-collapse table-auto w-full text-sm">
              {children}
            </table>
          );
        },
        th({ children }) {
          return (
            <th className="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">
              {renderContent(children)}
            </th>
          );
        },
        td({ children }) {
          return (
            <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
              {renderContent(children)}
            </td>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default ContentRenderer;