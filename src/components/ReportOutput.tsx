import { AlertCircle, Activity, Info, Shield, Stethoscope } from 'lucide-react';

interface ReportOutputProps {
  output: string;
}

interface ParsedSection {
  title: string;
  content: string;
  icon: 'condition' | 'findings' | 'explanation' | 'precautions' | 'consult';
}

export function ReportOutput({ output }: ReportOutputProps) {
  const parseOutput = (text: string): ParsedSection[] => {
    const sections: ParsedSection[] = [];

    const lines = text.split('\n');
    let currentSection = '';
    let currentContent: string[] = [];

    for (const line of lines) {
      if (line.startsWith('###')) {
        if (currentSection && currentContent.length > 0) {
          sections.push({
            title: currentSection,
            content: currentContent.join('\n').trim(),
            icon: getIconType(currentSection)
          });
        }
        currentSection = line.replace('###', '').trim();
        currentContent = [];
      } else if (line.trim()) {
        currentContent.push(line);
      }
    }

    if (currentSection && currentContent.length > 0) {
      sections.push({
        title: currentSection,
        content: currentContent.join('\n').trim(),
        icon: getIconType(currentSection)
      });
    }

    return sections;
  };

  const getIconType = (title: string): ParsedSection['icon'] => {
    const lower = title.toLowerCase();
    if (lower.includes('condition') || lower.includes('diagnosis')) return 'condition';
    if (lower.includes('finding') || lower.includes('abnormal')) return 'findings';
    if (lower.includes('explanation') || lower.includes('summary')) return 'explanation';
    if (lower.includes('precaution') || lower.includes('prevention')) return 'precautions';
    if (lower.includes('consult') || lower.includes('next')) return 'consult';
    return 'explanation';
  };

  const getIcon = (type: ParsedSection['icon']) => {
    const iconProps = { className: 'w-6 h-6' };
    switch (type) {
      case 'condition':
        return <AlertCircle {...iconProps} />;
      case 'findings':
        return <Activity {...iconProps} />;
      case 'precautions':
        return <Shield {...iconProps} />;
      case 'consult':
        return <Stethoscope {...iconProps} />;
      default:
        return <Info {...iconProps} />;
    }
  };

  const getColor = (type: ParsedSection['icon']) => {
    switch (type) {
      case 'condition':
        return 'from-red-500 to-orange-500';
      case 'findings':
        return 'from-blue-500 to-cyan-500';
      case 'precautions':
        return 'from-green-500 to-emerald-500';
      case 'consult':
        return 'from-teal-500 to-blue-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  const sections = parseOutput(output);

  return (
    <div className="space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2">
      {sections.map((section, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
        >
          <div className={`bg-gradient-to-r ${getColor(section.icon)} p-4`}>
            <div className="flex items-center space-x-3 text-white">
              {getIcon(section.icon)}
              <h3 className="text-lg font-semibold">{section.title}</h3>
            </div>
          </div>

          <div className="p-5">
            <div className="prose prose-sm max-w-none">
              {section.content.split('\n').map((line, lineIndex) => {
                if (line.startsWith('- **')) {
                  const match = line.match(/- \*\*(.+?)\*\*:? (.+)/);
                  if (match) {
                    return (
                      <div key={lineIndex} className="mb-3">
                        <p className="font-semibold text-gray-800 mb-1">{match[1]}</p>
                        <p className="text-gray-600 text-sm leading-relaxed">{match[2]}</p>
                      </div>
                    );
                  }
                }

                if (line.match(/^\d+\./)) {
                  const match = line.match(/^\d+\.\s+\*\*(.+?)\*\*:?\s*(.+)/);
                  if (match) {
                    return (
                      <div key={lineIndex} className="mb-4 pb-3 border-b border-gray-100 last:border-0">
                        <h4 className="font-bold text-gray-800 mb-2 text-base">{match[1]}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{match[2]}</p>
                      </div>
                    );
                  }
                  return (
                    <p key={lineIndex} className="text-gray-700 mb-2 leading-relaxed">
                      {line}
                    </p>
                  );
                }

                if (line.trim().startsWith('-')) {
                  const match = line.match(/^\s*-\s+\*\*(.+?)\*\*:?\s*(.+)/);
                  if (match) {
                    return (
                      <div key={lineIndex} className="flex items-start space-x-2 mb-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <div>
                          <span className="font-semibold text-gray-800">{match[1]}</span>
                          <span className="text-gray-600"> {match[2]}</span>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div key={lineIndex} className="flex items-start space-x-2 mb-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <p className="text-gray-700 leading-relaxed">{line.replace(/^\s*-\s*/, '')}</p>
                    </div>
                  );
                }

                if (line.trim()) {
                  return (
                    <p key={lineIndex} className="text-gray-700 mb-2 leading-relaxed">
                      {line}
                    </p>
                  );
                }

                return null;
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
