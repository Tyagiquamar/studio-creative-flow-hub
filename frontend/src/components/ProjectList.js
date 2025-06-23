import React, { useState } from "react";

const mockProjects = [
  { id: 1, title: "Website Design", client: "Acme Corp", budget: 500, description: "Design a modern website for Acme Corp." },
  { id: 2, title: "Mobile App Development", client: "Beta LLC", budget: 1200, description: "Develop a cross-platform mobile app." },
  { id: 3, title: "SEO Optimization", client: "Gamma Inc", budget: 300, description: "Improve SEO for Gamma Inc's website." },
];

function ProjectList({ onSelectProject }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Freelance Projects</h2>
      <ul className="divide-y divide-gray-200">
        {mockProjects.map((project) => (
          <li
            key={project.id}
            className={`p-4 cursor-pointer ${selected === project.id ? 'bg-blue-50' : ''}`}
            onClick={() => { setSelected(project.id); onSelectProject(project); }}
          >
            <div className="font-bold">{project.title}</div>
            <div className="text-gray-600">Client: {project.client}</div>
            <div className="text-gray-500 text-sm">Budget: ${project.budget}</div>
          </li>
        ))}
      </ul>
      {selected && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <h3 className="font-semibold">Project Details</h3>
          <div>{mockProjects.find(p => p.id === selected).description}</div>
        </div>
      )}
    </div>
  );
}

export default ProjectList; 