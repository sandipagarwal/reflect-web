export const API_URLS = {
    login: '/login',
    auth: '/auth',
    logout: '/logout',
    feedback: '/feedbacks',
    teamFeedback: '/team-feedbacks',
    user: {
        current: '/users/current'
    },
    taskProviderConfig: '/task-tracker/config-list',
    retrospectives: '/retrospectives',
    teamsList: '/teams',
    teamMembers: '/retrospectives/:retrospectiveID/team-members',
    retroDetails: '/retrospectives/:retrospectiveID',

    latestSprint: '/retrospectives/:retrospectiveID/latest-sprint',
    sprintList: '/retrospectives/:retrospectiveID/sprints',
    sprintDetails: '/retrospectives/:retrospectiveID/sprints/:sprintID',
    refreshSprintDetails: '/retrospectives/:retrospectiveID/sprints/:sprintID/process',

    sprintHighlights: '/retrospectives/:retrospectiveID/sprints/:sprintID/highlights',
    sprintHighlight: '/retrospectives/:retrospectiveID/sprints/:sprintID/highlights/:highlightID',
    sprintGoals: '/retrospectives/:retrospectiveID/sprints/:sprintID/goals',
    sprintGoal: '/retrospectives/:retrospectiveID/sprints/:sprintID/goals/:goalID',
    resolveSprintGoal: '/retrospectives/:retrospectiveID/sprints/:sprintID/goals/:goalID/resolve',
    sprintNotes: '/retrospectives/:retrospectiveID/sprints/:sprintID/notes',
    sprintNote: '/retrospectives/:retrospectiveID/sprints/:sprintID/notes/:noteID',

    sprintMembers: '/retrospectives/:retrospectiveID/sprints/:sprintID/members',
    sprintMember: '/retrospectives/:retrospectiveID/sprints/:sprintID/members/:memberID',
    sprintMemberSummary: '/retrospectives/:retrospectiveID/sprints/:sprintID/member-summary',

    sprintTaskSummary: '/retrospectives/:retrospectiveID/sprints/:sprintID/tasks/',
    sprintTaskDetails: '/retrospectives/:retrospectiveID/sprints/:sprintID/tasks/:taskID',
    sprintTaskMemberSummary: '/retrospectives/:retrospectiveID/sprints/:sprintID/tasks/:taskID/members',
    sprintTaskMember: '/retrospectives/:retrospectiveID/sprints/:sprintID/tasks/:taskID/members/:memberID',
    sprintTaskMarkDone: '/retrospectives/:retrospectiveID/sprints/:sprintID/tasks/:taskID/done',

    activateSprint: '/retrospectives/:retrospectiveID/sprints/:sprintID/activate',
    freezeSprint: '/retrospectives/:retrospectiveID/sprints/:sprintID/freeze',
    discardSprint: '/sprints/:sprintID',
};
