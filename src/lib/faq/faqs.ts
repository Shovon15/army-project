// TODO: sample answers. Replace with the museum's real visitor information
// (or load from the CMS: api.page.faq).

export type FaqGroup = { id: string; title: string; items: IFaqItem[] };

/** Short visitor FAQ shown on About, Collection, Contact and collection pages. */
export const VISITOR_FAQS: IFaqItem[] = [
  {
    question: "What are the museum opening hours?",
    answer:
      "We are open daily from 10:00 AM to 6:00 PM. The museum is closed on Sundays and public holidays.",
  },
  {
    question: "Do I need to book tickets in advance?",
    answer:
      "Walk-ins are welcome, but booking online is recommended for weekends and special exhibitions so you can skip the queue.",
  },
  {
    question: "Is photography allowed inside the museum?",
    answer:
      "Personal photography without flash is allowed in most galleries. Some temporary exhibitions do not allow photography; look for the signs at the entrance.",
  },
  {
    question: "Are guided tours available?",
    answer:
      "Yes. Expert-led tours run several times a day and private group tours can be booked in advance through our contact page.",
  },
];

/** Full FAQ page, grouped by topic. `id` is the anchor used by the sidebar. */
export const FAQ_GROUPS: FaqGroup[] = [
  { id: "general", title: "General Questions", items: VISITOR_FAQS },
  {
    id: "collections",
    title: "Collections & Galleries",
    items: [
      {
        question: "How many galleries does the museum have?",
        answer:
          "Our permanent collection is spread across twelve galleries, from classical art and sculpture to photography and contemporary work.",
      },
      {
        question: "Are all collections on display at the same time?",
        answer:
          "Most of the permanent collection is always on view. Some fragile works are rotated to protect them from light, so a few pieces change every season.",
      },
      {
        question: "Can I see objects that are not on display?",
        answer:
          "Researchers can request access to items in storage. Please contact us at least two weeks before your visit with details of what you would like to see.",
      },
      {
        question: "Do you lend or borrow artworks from other museums?",
        answer:
          "Yes. We regularly loan works to partner institutions and host visiting pieces in our temporary exhibitions.",
      },
    ],
  },
  {
    id: "events",
    title: "Events & Workshops",
    items: [
      {
        question: "How can I find out about upcoming events?",
        answer:
          "Upcoming events are listed on our home page and in our newsletter. Subscribe in the footer to hear about them first.",
      },
      {
        question: "Do I need to register for workshops?",
        answer:
          "Yes. Workshops have limited places, so registration is required. Most workshops include all materials.",
      },
      {
        question: "Are there activities for children and families?",
        answer:
          "We run family art sessions every weekend and special programmes during school holidays, designed for children aged 5 and up.",
      },
      {
        question: "Can I host a private event at the museum?",
        answer:
          "Selected galleries and our courtyard can be hired for private and corporate events. Get in touch through the contact page for availability.",
      },
    ],
  },
  {
    id: "visitor-guidelines",
    title: "Photography & Visitor Guidelines",
    items: [
      {
        question: "Can I use a flash or tripod?",
        answer:
          "Flash photography, tripods and selfie sticks are not allowed in the galleries, as they can damage artworks and disturb other visitors.",
      },
      {
        question: "Can I bring food or drinks inside?",
        answer:
          "Food and drinks are only allowed in the café and courtyard. Bottled water may be carried but not opened in the galleries.",
      },
      {
        question: "Is there a cloakroom for bags?",
        answer:
          "Yes. Large bags, backpacks and umbrellas must be left in the free cloakroom near the main entrance.",
      },
      {
        question: "Is the museum accessible for wheelchair users?",
        answer:
          "All galleries are step-free and reachable by lift. Wheelchairs are available to borrow free of charge at the information desk.",
      },
    ],
  },
  {
    id: "support",
    title: "Contact & Support",
    items: [
      {
        question: "How can I contact the museum?",
        answer:
          "You can email us or use the form on our contact page. Our team replies within two working days.",
      },
      {
        question: "I lost an item during my visit. What should I do?",
        answer:
          "Please contact us with a description of the item and the date of your visit. Found items are kept for 30 days.",
      },
      {
        question: "Can I get a refund on my ticket?",
        answer:
          "Tickets can be refunded or moved to another date up to 24 hours before your visit.",
      },
      {
        question: "How can I support the museum?",
        answer:
          "Becoming a member, making a donation or volunteering all help us preserve and share our collections. Contact us to learn more.",
      },
    ],
  },
];

export const ALL_FAQS = FAQ_GROUPS.flatMap((g) => g.items);
