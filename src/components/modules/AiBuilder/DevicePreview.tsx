"use client";

// Transformation function to convert AI response to DevicePreview format
export const transformAIResponseToPreviewContent = (aiResponse: any) => {
  // Parse goals if it's a string
  const parseGoals = (goals: any) => {
    if (Array.isArray(goals)) return goals;
    if (typeof goals === "string") {
      return goals
        .split(/[•\n-]/)
        .map((g: string) => g.trim())
        .filter((g: string) => g.length > 0);
    }
    return [];
  };

  return {
    title: aiResponse.title || "Case Study",
    overview: aiResponse.projectOverview || "",
    problem: aiResponse.problemStatement || "",
    goals: parseGoals(aiResponse.goalsAndObjectives) || [],
    research: aiResponse.research || "",
    solution: aiResponse.keyInsights || aiResponse.solution || "",
    results: aiResponse.results || "",
    takeaways: Array.isArray(aiResponse.takeaways)
      ? aiResponse.takeaways
      : aiResponse.keyInsights
      ? [aiResponse.keyInsights]
      : [],
    images: aiResponse.imageUrls
      ? aiResponse.imageUrls.map((img: any) => img.url)
      : [],
    stats: generateStatsFromContent(aiResponse),
  };
};

// Helper function to generate stats from AI content
const generateStatsFromContent = (aiResponse: any) => {
  const stats = [];
  return stats;
};

interface DevicePreviewProps {
  content: any;
}

const DevicePreview = ({ content }: DevicePreviewProps) => {
  const transformedContent = transformContent(content);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-auto">
        <div className="w-full h-full">
          {transformedContent ? (
            <div className="max-w-6xl mx-auto p-8">
              <CaseStudyRenderer content={transformedContent} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">No preview available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const transformContent = (content: any) => {
  if (!content) return null;

  // Check if it's already transformed (has 'overview' field)
  if (content.overview !== undefined) {
    return content;
  }

  // Check if it's in AI response format and transform it
  // The AI response has these specific fields
  const hasAIFields =
    content.projectOverview !== undefined ||
    content.problemStatement !== undefined ||
    content.goalsAndObjectives !== undefined ||
    content.keyInsights !== undefined;

  if (hasAIFields) {
    return transformAIResponseToPreviewContent(content);
  }

  return content;
};

const CaseStudyRenderer = ({ content }: { content: any }) => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">{content.title}</h1>
        <div className="text-base text-gray-700 leading-relaxed">
          <p className="font-semibold mb-2">Project Overview</p>
          <p>{content.overview}</p>
        </div>
      </div>

      {/* Stats/Metrics Section */}
      {content.stats && content.stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
          {content.stats.map((stat: any, index: number) => (
            <div
              key={index}
              className="p-6 rounded-lg"
              style={{ backgroundColor: stat.bgColor || "#f3f4f6" }}
            >
              <div
                className="text-3xl font-bold"
                style={{ color: stat.textColor || "#111827" }}
              >
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Problem Statement */}
      {content.problem && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Problem Statement
          </h2>
          <div className="text-gray-700 space-y-3">
            {typeof content.problem === "string" ? (
              <p className="leading-relaxed">{content.problem}</p>
            ) : (
              <ul className="list-disc pl-5 space-y-2">
                {content.problem.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {/* Goals & Objectives */}
      {content.goals && content.goals.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Goals & Objectives
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            {content.goals.map((goal: string, index: number) => (
              <li key={index}>{goal}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Research */}
      {content.research && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Research</h2>
          <div className="text-gray-700 space-y-3">
            <p className="leading-relaxed">{content.research}</p>
          </div>
        </section>
      )}

      {/* Images/Screenshots */}
      {content.images && content.images.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Design Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.images.map((image: string, index: number) => (
              <img
                key={index}
                src={image}
                alt={`Project screenshot ${index + 1}`}
                className="w-full h-auto rounded-lg shadow-md border border-gray-200"
              />
            ))}
          </div>
        </div>
      )}

      {/* Solution */}
      {content.solution && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Solution</h2>
          <div className="text-gray-700 space-y-3">
            <p className="leading-relaxed">{content.solution}</p>
          </div>
        </section>
      )}

      {/* Results/Impact */}
      {content.results && content.results.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Results & Impact
          </h2>
          <div className="text-gray-700 space-y-3">
            {typeof content.results === "string" ? (
              <p className="leading-relaxed">{content.results}</p>
            ) : (
              <ul className="list-disc pl-5 space-y-2">
                {content.results.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {/* Key Takeaways */}
      {content.takeaways && content.takeaways.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Key Takeaways
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            {content.takeaways.map((takeaway: string, index: number) => (
              <li key={index}>{takeaway}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default DevicePreview;
