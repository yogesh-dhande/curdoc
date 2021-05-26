export default async ({ app }, inject) => {
  const EventName = app.$fireModule.analytics.EventName;

  const analyticsEvents = {
    ...EventName,
    VIEW_PROJECT_CODE: "view_project_code",
    VIEW_PROJECT_APP: "view_project_app",
    CREATE_PROJECT: "create_project",
  };

  inject("analyticsEvents", analyticsEvents);
};
