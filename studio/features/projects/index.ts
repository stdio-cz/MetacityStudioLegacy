"use server";

import {
  canCreateProject,
  canEditOwnProject,
  canReadOwnProjects,
} from "../auth/acl";
import { getUserToken } from "../auth/user";
import { Project } from "../db/entities/project";
import { injectRepository } from "../db/helpers";

export async function createProject(
  projectData: Pick<Project, "name" | "description">
): Promise<Project> {
  if (!(await canCreateProject())) throw new Error("Unauthorized");

  const user = await getUserToken()!;

  const ProjectRepository = await injectRepository(Project);

  const project = await ProjectRepository.save({
    ...projectData,
    user: { id: user.id, email: user.email },
  });

  return project;
}

export async function getOwnProjects(): Promise<Project[]> {
  if (!(await canReadOwnProjects())) throw new Error("Unauthorized");

  const user = await getUserToken()!;

  const ProjectRepository = await injectRepository(Project);

  const projects = await ProjectRepository.find({
    where: { user: { id: user.id } },
  });
  return projects;
}

export async function getProjectById(id: number): Promise<Project | null> {
  if (!(await canReadOwnProjects())) throw new Error("Unauthorized");

  const user = await getUserToken()!;

  const ProjectRepository = await injectRepository(Project);

  const project = await ProjectRepository.findOne({
    where: { id, user: { id: user.id } },
  });
  return project;
}

export async function updateProject(
  id: number,
  projectData: Partial<Omit<Project, "id">>
): Promise<Project | null> {
  if (!(await canEditOwnProject())) throw new Error("Unauthorized");

  const user = await getUserToken()!;

  const ProjectRepository = await injectRepository(Project);

  const project = await ProjectRepository.findOne({
    where: { id, user: { id: user.id } },
  });

  if (!project) throw new Error("Not Found");

  return ProjectRepository.save({ ...projectData, id });
}

export async function deleteProject(id: number): Promise<boolean> {
  if (!(await canEditOwnProject())) throw new Error("Unauthorized");

  const user = await getUserToken()!;

  const ProjectRepository = await injectRepository(Project);

  const project = await ProjectRepository.findOne({
    where: { id, user: { id: user.id } },
  });

  if (!project) throw new Error("Not Found");

  await ProjectRepository.delete(id);
  return true;
}
