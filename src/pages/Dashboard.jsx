import { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = ({ token }) => {
  const [activeTab, setActiveTab] = useState("view"); // 'view' or 'add'
  const [projects, setProjects] = useState([]);
  const [workExperiences, setWorkExperiences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    tech: [],
    links: {
      github: "",
      live: "",
    },
  });
  const [newWorkExp, setNewWorkExp] = useState({
    company: "",
    role: "",
    period: "",
    description: "",
    technologies: [],
    achievements: ["", ""], // Starting with 2 empty achievements
  });
  const [techInput, setTechInput] = useState("");
  const [technologiesInput, setTechnologiesInput] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [projRes, workRes] = await Promise.all([
        axios.get("http://localhost:5500/api/projects", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5500/api/work-experience", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setProjects(projRes.data);
      setWorkExperiences(workRes.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch data");
      console.error("Data fetch error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5500/api/projects", newProject, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewProject({
        title: "",
        description: "",
        tech: [],
        links: {
          github: "",
          live: "",
        },
      });
      setTechInput("");
      fetchData();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create project");
    }
  };

  const handleWorkExpSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5500/api/work-experience",
        newWorkExp,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNewWorkExp({
        company: "",
        role: "",
        period: "",
        description: "",
        technologies: [],
        achievements: ["", ""],
      });
      setTechnologiesInput("");
      fetchData();
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to create work experience"
      );
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await axios.delete(`http://localhost:5500/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchData(); // Refresh the list
      } catch (error) {
        setError(error.response?.data?.message || "Failed to delete project");
      }
    }
  };

  const handleDeleteWorkExp = async (workExpId) => {
    if (
      window.confirm("Are you sure you want to delete this work experience?")
    ) {
      try {
        await axios.delete(
          `http://localhost:5500/api/work-experience/${workExpId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        fetchData(); // Refresh the list
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to delete work experience"
        );
      }
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h2>
          <div className="flex space-x-4">
            {/* Add any header actions/buttons here if needed */}
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg bg-gray-200 p-1">
            <button
              onClick={() => setActiveTab("view")}
              className={`${
                activeTab === "view"
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              } px-6 py-2 rounded-lg transition-all duration-200 font-medium`}
            >
              View Content
            </button>
            <button
              onClick={() => setActiveTab("add")}
              className={`${
                activeTab === "add"
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              } px-6 py-2 rounded-lg transition-all duration-200 font-medium`}
            >
              Add Content
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {activeTab === "view" ? (
            // View Content Tab
            <div className="grid gap-8 md:grid-cols-2">
              {/* Projects List */}
              <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Projects
                  </h3>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {projects.length} items
                  </span>
                </div>
                <div className="p-6">
                  {projects.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No projects found</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {projects.map((project) => (
                        <div
                          key={project._id}
                          className="group p-6 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 space-y-4"
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-xl text-gray-800 group-hover:text-blue-600">
                              {project.title}
                            </h4>
                            <div className="flex space-x-3">
                              {project.links.github && (
                                <a
                                  href={project.links.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                  <svg
                                    className="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
                                  </svg>
                                </a>
                              )}
                              {project.links.live && (
                                <a
                                  href={project.links.live}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                  <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                  </svg>
                                </a>
                              )}
                              <button
                                onClick={() => handleDeleteProject(project._id)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                                title="Delete Project"
                              >
                                <svg
                                  className="w-6 h-6"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <p className="text-gray-600">{project.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {project.tech.map((tech, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* Work Experience List */}
              <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Work Experience
                  </h3>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {workExperiences.length} items
                  </span>
                </div>
                <div className="p-6">
                  {workExperiences.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No work experiences found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {workExperiences.map((work) => (
                        <div
                          key={work._id}
                          className="group p-6 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 space-y-4"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-xl text-gray-800 group-hover:text-blue-600">
                                {work.company}
                              </h4>
                              <p className="text-blue-600 font-medium">
                                {work.role}
                              </p>
                              <p className="text-gray-500 text-sm">
                                {work.period}
                              </p>
                            </div>
                            <button
                              onClick={() => handleDeleteWorkExp(work._id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="Delete Work Experience"
                            >
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>

                          <p className="text-gray-600">{work.description}</p>

                          {/* Technologies */}
                          <div className="flex flex-wrap gap-2">
                            {work.technologies.map((tech, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>

                          {/* Achievements */}
                          <div className="space-y-2">
                            <h5 className="font-medium text-gray-700">
                              Key Achievements:
                            </h5>
                            <ul className="list-disc list-inside space-y-1">
                              {work.achievements.map((achievement, index) => (
                                <li key={index} className="text-gray-600 ml-2">
                                  {achievement}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            </div>
          ) : (
            // Add Content Tab
            <div className="grid gap-8 md:grid-cols-2">
              {/* Add Project Form */}
              <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Add New Project
                  </h3>
                </div>
                <div className="p-6">
                  <form onSubmit={handleProjectSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={newProject.title}
                        onChange={(e) =>
                          setNewProject({
                            ...newProject,
                            title: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={newProject.description}
                        onChange={(e) =>
                          setNewProject({
                            ...newProject,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="4"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Technologies (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={techInput}
                        onChange={(e) => {
                          setTechInput(e.target.value);
                          setNewProject({
                            ...newProject,
                            tech: e.target.value
                              .split(",")
                              .map((t) => t.trim())
                              .filter(Boolean),
                          });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., React, TypeScript, Tailwind CSS"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          GitHub Link
                        </label>
                        <input
                          type="url"
                          value={newProject.links.github}
                          onChange={(e) =>
                            setNewProject({
                              ...newProject,
                              links: {
                                ...newProject.links,
                                github: e.target.value,
                              },
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://github.com/..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Live Demo Link
                        </label>
                        <input
                          type="url"
                          value={newProject.links.live}
                          onChange={(e) =>
                            setNewProject({
                              ...newProject,
                              links: {
                                ...newProject.links,
                                live: e.target.value,
                              },
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02]"
                    >
                      Add Project
                    </button>
                  </form>
                </div>
              </section>

              {/* Add Work Experience Form */}
              <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Add Work Experience
                  </h3>
                </div>
                <div className="p-6">
                  <form onSubmit={handleWorkExpSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company
                        </label>
                        <input
                          type="text"
                          value={newWorkExp.company}
                          onChange={(e) =>
                            setNewWorkExp({
                              ...newWorkExp,
                              company: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Role
                        </label>
                        <input
                          type="text"
                          value={newWorkExp.role}
                          onChange={(e) =>
                            setNewWorkExp({
                              ...newWorkExp,
                              role: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Period
                      </label>
                      <input
                        type="text"
                        value={newWorkExp.period}
                        onChange={(e) =>
                          setNewWorkExp({
                            ...newWorkExp,
                            period: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., September 2024 – Present"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={newWorkExp.description}
                        onChange={(e) =>
                          setNewWorkExp({
                            ...newWorkExp,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="4"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Technologies (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={technologiesInput}
                        onChange={(e) => {
                          setTechnologiesInput(e.target.value);
                          setNewWorkExp({
                            ...newWorkExp,
                            technologies: e.target.value
                              .split(",")
                              .map((t) => t.trim())
                              .filter(Boolean),
                          });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., React, TypeScript, Tailwind CSS"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Achievements
                      </label>
                      {newWorkExp.achievements.map((achievement, index) => (
                        <div key={index} className="mb-2">
                          <textarea
                            value={achievement}
                            onChange={(e) => {
                              const newAchievements = [
                                ...newWorkExp.achievements,
                              ];
                              newAchievements[index] = e.target.value;
                              setNewWorkExp({
                                ...newWorkExp,
                                achievements: newAchievements,
                              });
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                            rows="2"
                            placeholder={`Achievement ${index + 1}`}
                            required
                          />
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          setNewWorkExp({
                            ...newWorkExp,
                            achievements: [...newWorkExp.achievements, ""],
                          })
                        }
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        + Add Another Achievement
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02]"
                    >
                      Add Work Experience
                    </button>
                  </form>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
