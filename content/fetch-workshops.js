const { markdownToHtml } = require('./markdown');

const queryPages = /* GraphQL */ `
  query($conferenceTitle: ConferenceTitle, $eventYear: EventYear) {
    conf: conferenceBrand(where: { title: $conferenceTitle }) {
      id
      status
      year: conferenceEvents(where: { year: $eventYear }) {
        id
        status
        schedule: daySchedules(where: { workshops_some: {} }) {
          id
          status
          additionalEvents
          workshops {
            id
            status
            title
            description
            prerequisites
            content
            additionalInfo
            level
            speaker {
              name
            }
          }
        }
      }
    }
  }
`;

const fetchData = async(client, vars) => {
  const data = await client
    .request(queryPages, vars)
    .then(res => res.conf.year[0].schedule);

  const workshops = data.reduce(
    (all, day) => [
      ...all,
      ...day.workshops.map(ws => ({
        ...ws,
        trainer: ws.speaker.name,
        speaker: undefined,
        ...(day.additionalEvents &&
          day.additionalEvents.find(({ title }) => title === ws.title)),
      })),
    ],
    []
  );

  const allWorkshops = await Promise.all(
    workshops.map(async wrp => ({
      ...wrp,
      description: await markdownToHtml(wrp.description),
      additionalInfo: await markdownToHtml(wrp.additionalInfo),
    }))
  );

  console.log(
    'TCL: fetchData -> workshops',
    JSON.stringify(workshops, null, 2)
  );
  return {
    workshops: allWorkshops,
  };
};

module.exports = {
  fetchData,
};
