import { ProjectContent, ProjectItem } from "@/types/portfolio";

const extractCloudinaryPublicId = (url: string): string => {
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return "";

    // Get everything after /upload/
    const afterUpload = parts[1];

    // Remove version prefix (v1761220431/) and file extension
    const withoutVersion = afterUpload.replace(/^v\d+\//, "");
    const withoutExtension = withoutVersion.replace(/\.[^.]+$/, "");

    return withoutExtension;
  } catch (error) {
    console.error("Error extracting public ID from URL:", url, error);
    return "";
  }
};

/**
 * Transforms AI-generated case study data into ProjectItem array
 * for use in the PortfolioBuilder component
 */
export const transformAICaseStudyToProjects = (
  aiData: any
): { projects: ProjectItem[]; title: string } => {
  const projects: ProjectItem[] = [];
  let counter = 0;

  const generateId = () => `ai-content-${counter++}`;

  // Helper to create combined heading + text project (merged in one block)
  const createSectionProject = (
    heading: string,
    content: string,
    title: string
  ): ProjectItem => ({
    id: generateId(),
    content: {
      type: "text",
      data: `<h2><strong>${heading}</strong></h2><p></p><p>${content}</p>`,
      title,
    },
  });

  // Helper to create text project without heading
  const createTextProject = (content: string, title: string): ProjectItem => ({
    id: generateId(),
    content: {
      type: "text",
      data: `<p>${content}</p>`,
      title,
    },
  });

  // 1. Add Project Overview Section (heading + text combined)
  if (aiData.projectOverview) {
    projects.push(
      createSectionProject(
        "Project Overview",
        aiData.projectOverview,
        "Project Overview"
      )
    );
  }

  // 2. Add Problem Statement Section (heading + text combined)
  if (aiData.problemStatement) {
    projects.push(
      createSectionProject(
        "Problem Statement",
        aiData.problemStatement,
        "Problem Statement"
      )
    );
  }

  // 3. Add Goals & Objectives Section (heading + content combined)
  if (aiData.goalsAndObjectives) {
    // Parse goals if it's a string with bullet points
    let goalsContent = aiData.goalsAndObjectives;
    let goalsHtml = "";

    if (typeof goalsContent === "string") {
      // Check if it contains line breaks or bullet points
      const goalsList = goalsContent
        .split(/[•\n-]/)
        .map((g: string) => g.trim())
        .filter((g: string) => g.length > 0);

      // If multiple goals found, create a list
      if (goalsList.length > 1) {
        goalsHtml = `<h2><strong>Goals & Objectives</strong></h2><p></p><ul>${goalsList
          .map((g) => `<li>${g}</li>`)
          .join("")}</ul>`;
      } else {
        // Single paragraph
        goalsHtml = `<h2><strong>Goals & Objectives</strong></h2><p></p><p>${goalsContent}</p>`;
      }
    } else {
      goalsHtml = `<h2><strong>Goals & Objectives</strong></h2><p></p><p>${goalsContent}</p>`;
    }

    projects.push({
      id: generateId(),
      content: {
        type: "text",
        data: goalsHtml,
        title: "Goals & Objectives",
      },
    });
  }

  // 4. Add Research Section (heading + text combined)
  if (aiData.research) {
    projects.push(
      createSectionProject("Research", aiData.research, "Research")
    );
  }

  // 5. Add Images (before key insights for better flow)
  if (aiData.imageUrls && Array.isArray(aiData.imageUrls)) {
    aiData.imageUrls.forEach((img: any, index: number) => {
      const publicId = extractCloudinaryPublicId(img.url);

      projects.push({
        id: generateId(),
        content: {
          type: "image",
          data: img.url,
          publicUrl: publicId,
          title: `Case study image ${index + 1}`,
          altText: `Case study image ${index + 1}`,
          caption: "",
          tags: [],
        },
      });
    });
  }

  // 6. Add Key Insights / Solution Section (heading + text combined)
  if (aiData.keyInsights) {
    // Check if keyInsights contains multiple insights
    let insightsHtml = "";
    const insightsText = aiData.keyInsights;

    if (typeof insightsText === "string") {
      // Check for bullet points or line breaks
      const insightsList = insightsText
        .split(/[•\n-]/)
        .map((i: string) => i.trim())
        .filter((i: string) => i.length > 0);

      if (insightsList.length > 1) {
        insightsHtml = `<h2><strong>Key Insights</strong></h2><p></p><ul>${insightsList
          .map((i) => `<li>${i}</li>`)
          .join("")}</ul>`;
      } else {
        insightsHtml = `<h2><strong>Key Insights</strong></h2><p></p><p>${insightsText}</p>`;
      }
    } else {
      insightsHtml = `<h2><strong>Key Insights</strong></h2><p></p><p>${insightsText}</p>`;
    }

    projects.push({
      id: generateId(),
      content: {
        type: "text",
        data: insightsHtml,
        title: "Key Insights",
      },
    });
  }

  // 7. Add Results Section (if available) - heading + text combined
  if (aiData.results) {
    let resultsHtml = "";

    if (Array.isArray(aiData.results)) {
      resultsHtml = `<h2><strong>Results & Impact</strong></h2><p></p><ul>${aiData.results
        .map((r: string) => `<li>${r}</li>`)
        .join("")}</ul>`;
    } else if (typeof aiData.results === "string") {
      resultsHtml = `<h2><strong>Results & Impact</strong></h2><p></p><p>${aiData.results}</p>`;
    }

    projects.push({
      id: generateId(),
      content: {
        type: "text",
        data: resultsHtml,
        title: "Results & Impact",
      },
    });
  }

  // 8. Add Takeaways (if available) - heading + list combined
  if (aiData.takeaways) {
    let takeawaysHtml = "";

    if (Array.isArray(aiData.takeaways)) {
      takeawaysHtml = `<h2><strong>Key Takeaways</strong></h2><p></p><ul>${aiData.takeaways
        .map((t: string) => `<li>${t}</li>`)
        .join("")}</ul>`;
    } else if (typeof aiData.takeaways === "string") {
      takeawaysHtml = `<h2><strong>Key Takeaways</strong></h2><p></p><p>${aiData.takeaways}</p>`;
    }

    projects.push({
      id: generateId(),
      content: {
        type: "text",
        data: takeawaysHtml,
        title: "Key Takeaways",
      },
    });
  }

  return {
    projects,
    title: aiData.title || "Untitled Case Study",
  };
};

/**
 * Checks if the current route is from AI case study edit
 */
export const isAICaseStudyEdit = (searchParams: URLSearchParams): boolean => {
  return searchParams.get("source") === "ai-case-study";
};

/**
 * Transform ProjectItems back to case study format for preview
 */
export const transformProjectsToAICaseStudy = (
  projects: ProjectItem[],
  title: string
): any => {
  const sections: any = {
    title,
    projectOverview: "",
    problemStatement: "",
    goalsAndObjectives: "",
    research: "",
    keyInsights: "",
    imageUrls: [],
  };

  projects.forEach((project) => {
    if (project.content.type === "text") {
      const textData = project.content.data || "";

      // Extract heading and content
      const headingMatch = textData.match(/<h2><strong>(.*?)<\/strong><\/h2>/);
      if (headingMatch) {
        const heading = headingMatch[1].toLowerCase();
        // Remove the heading to get just the content
        const content = textData
          .replace(/<h2><strong>.*?<\/strong><\/h2>/, "")
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim();

        if (heading.includes("project overview")) {
          sections.projectOverview = content;
        } else if (heading.includes("problem")) {
          sections.problemStatement = content;
        } else if (heading.includes("goal")) {
          sections.goalsAndObjectives = content;
        } else if (heading.includes("research")) {
          sections.research = content;
        } else if (heading.includes("insight")) {
          sections.keyInsights = content;
        }
      }
    } else if (project.content.type === "image" && project.content.data) {
      sections.imageUrls.push({
        url: project.content.data,
        publicId:
          project.content.publicUrl ||
          extractCloudinaryPublicId(project.content.data),
      });
    }
  });

  return sections;
};
