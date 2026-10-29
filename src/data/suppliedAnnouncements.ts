export interface SuppliedAnnouncement {
  id: string;
  author: string;
  title: string;
  content: string;
}

export const suppliedAnnouncements: SuppliedAnnouncement[] = [
  {
    id: 'community-update-01-staff-recruitment',
    author: 'Update from V',
    title: 'Staff Recruitment',
    content: `We are currently recruiting for Management, Internal Affairs (IA), and Administration.

Those interested in applying, requesting a fast pass, or transferring should open a **High Rank Ticket** in the assistance channel.

### Chain of Command (CoC)

- Ownership
- Management
- Internal Affairs (IA)
- Administration
- Moderation
- Trial Moderator

![Staff](https://cdn.discordapp.com/emojis/1157474237414645830.png)`,
  },
  {
    id: 'community-update-02-staff-partnership',
    author: 'Update from V',
    title: 'Staff Partnership',
    content: `Hello,

We are currently accepting **Staff Partnership** applications!

![Staff Partnership badge](https://cdn.discordapp.com/emojis/1225993462063566949.png)

### Requirements

- 500+ members in your server
- 20+ active staff members

If you meet the requirements and are interested in a Staff Partnership, please open a ticket.

**Applications will close on October 10th.**`,
  },
  {
    id: 'community-update-03-fast-pass-transfers',
    author: 'Update from V',
    title: 'Fast-Pass and Staff Transfers',
    content: `Hello,

We are currently offering **Fast-Pass and Staff Transfers**. Please note that this is a **temporary opportunity** and may close at any time.

If you are interested, make sure to create a ticket so our team can assist you.

Thank you!`,
  },
];
