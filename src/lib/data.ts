import type { User, Conversation } from "./types"

export const users: User[] = [
  {
    id: "user1",
    name: "Mbah Enow",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: false,
  },
  {
    id: "user2",
    name: "Ea Tipene",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: true,
    country: "Canada",
  },
  {
    id: "user3",
    name: "Vicente de la Cruz",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: false,
  },
  {
    id: "user4",
    name: "Wen Yahui",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: false,
  },
  {
    id: "user5",
    name: "Amelia Cabal",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: false,
  },
  {
    id: "user6",
    name: "Jennifer Reid",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: false,
  },
  {
    id: "user7",
    name: "Lacara Jones",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: false,
  },
  {
    id: "user8",
    name: "Linzell Bowman",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: false,
  },
  {
    id: "user9",
    name: "Tsutsui Ichiha",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: false,
  },
  {
    id: "staff1",
    name: "Ann Tsibulski",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: true,
  },
]

export const conversations: Conversation[] = [
  {
    id: "conv1",
    userId: "user1",
    preview: "Job Title: Construction Worker",
    unreadCount: 0,
    messages: [
      {
        senderId: "user1",
        text: "Job Title: Construction Worker",
        time: "09:45",
      },
      {
        senderId: "user1",
        text: "Enquiry: Hello, I have over 5 years of hands-on experience working in residential and commercial construction projects. My expertise includes framing, drywall installation, and concrete work. I’m skilled in reading blueprints, operating heavy machinery, and adhering to OSHA safety standards. I'm very interested in joining your team and contributing to ongoing and upcoming projects.",
        time: "09:45",
      },
      {
        senderId: "user",
        text: "Are you available to start work tomorrow?",
        time: "09:47",
      },
      {
        senderId: "user1",
        text: "Sure I will be available",
        time: "09:48",
      },
    ],
  },
  {
    id: "conv2",
    userId: "user2",
    preview: "Job Title: Construction Site Supervisor",
    unreadCount: 0,
    roomNumber: "102",
    category: "Standard",
    dateRange: "Oct 1 — Oct 12",
    messages: [
      {
        senderId: "user2",
        text: "Job Title: Construction Site Supervisor",
        time: "10:34",
        date: "Today",
      },
      {
        senderId: "user2",
        text: "Enquiry: Hi, I have 8 years of experience supervising large-scale construction sites, including residential communities and mid-rise commercial buildings. I specialize in coordinating subcontractors, ensuring compliance with safety regulations, and maintaining project schedules. I’m seeking a leadership opportunity where I can apply my skills to deliver projects efficiently and within budget.",
        time: "10:34",
        images: [
          "/placeholder.svg?height=100&width=100",
          "/placeholder.svg?height=100&width=100",
          "/placeholder.svg?height=100&width=100",
        ],
      },
      {
        senderId: "staff1",
        text: "What's your budget?",
        time: "10:35",
        systemMessage: true,
      },
    ],
  },
  {
    id: "conv3",
    userId: "user3",
    preview: "Job Title: Civil Engineer (Construction)",
    unreadCount: 0,
    messages: [
      {
        senderId: "user3",
        text: "Job Title: Civil Engineer (Construction)",
        time: "11:20",
      },
      {
        senderId: "user3",
        text: "Enquiry:Good day, I hold a Bachelor's degree in Civil Engineering and bring 6 years of experience working on infrastructure development, road construction, and foundation projects. I am highly proficient in AutoCAD, Civil 3D, and project management tools. I would love the opportunity to contribute my technical expertise to your construction projects.",
        time: "11:21",
      },
    ],
  },
  {
    id: "conv4",
    userId: "user4",
    preview: "Job Title: Heavy Equipment Operator",
    unreadCount: 0,
    messages: [
      {
        senderId: "user4",
        text: "Job Title: Heavy Equipment Operator",
        time: "14:05",
      },
      {
        senderId: "user4",
        text: "Enquiry:Hello, I have 7 years of experience operating excavators, bulldozers, and cranes on construction sites. I am certified and trained to handle machinery under challenging conditions, including tight urban spaces and uneven terrains. I’m very interested in opportunities where I can utilize my operating skills to support efficient site operations.",
        time: "14:06",
      },
    ],
  },
  {
    id: "conv5",
    userId: "user5",
    preview: "Job Title: Finish Carpenter",
    unreadCount: 0,
    expired: true,
    messages: [
      {
        senderId: "user5",
        text: "Job Title: Finish Carpenter",
        time: "15:30",
      },
      {
        senderId: "user",
        text: "Enquiry: Hi there, I have 9 years of experience specializing in fine carpentry, cabinetry, and interior trim work for residential and commercial properties. I’m skilled in reading detailed plans, measuring precisely, and delivering high-end finishes. I am looking for a role where I can apply my craftsmanship to quality-driven construction projects.",
        time: "15:32",
      },
    ],
  },
  {
    id: "conv6",
    userId: "user6",
    preview: "Job Title: Construction Project Manager",
    unreadCount: 0,
    expired: true,
    messages: [
      {
        senderId: "user6",
        text: "Job Title: Construction Project Manager",
        time: "09:15",
      },
      {
        senderId: "user6",
        text: "Enquiry: I have over 10 years of experience managing construction projects from initiation to completion, with expertise in budgeting, scheduling, vendor management, and quality assurance. I have successfully delivered multiple commercial and residential developments on time and within scope. I am excited about opportunities to lead and manage new projects in your organization.",
        time: "09:16",
      },
    ],
  },
  {
    id: "conv7",
    userId: "user7",
    preview: "Job Title: Construction Plumber",
    unreadCount: 0,
    expired: true,
    messages: [
      {
        senderId: "user7",
        text: "Job Title: Construction Plumber",
        time: "16:45",
      },
      {
        senderId: "user7",
        text: "Enquiry: Hi, I am a licensed plumber with 6 years of experience specializing in new construction plumbing, piping systems, and fixture installations. I am familiar with both residential and commercial building codes and have a strong background in reading blueprints and schematics. I am seeking opportunities to work on challenging construction projects.",
        time: "16:48",
      },
    ],
  },
  {
    id: "conv8",
    userId: "user8",
    preview: "Construction Electrician",
    unreadCount: 0,
    expired: true,
    messages: [
      {
        senderId: "user8",
        text: "Construction Electrician",
        time: "08:30",
      },
      {
        senderId: "user8",
        text: "Enquiry: Hello, I have 5 years of experience as an electrician working on construction projects, including wiring, conduit installation, and system troubleshooting. I’m certified and have strong knowledge of local electrical codes and safety practices. I’m looking for a position where I can contribute my expertise to new builds and remodeling projects.",
        time: "08:35",
      },
    ],
  },
  {
    id: "conv9",
    userId: "user9",
    preview: "Job Title: Mason / Bricklayer",
    unreadCount: 0,
    expired: true,
    messages: [
      {
        senderId: "user9",
        text: "Job Title: Mason / Bricklayer",
        time: "12:15",
      },
      {
        senderId: "user9",
        text: "Enquiry: With 12 years of experience in masonry, I specialize in brickwork, block laying, stonework, and concrete finishing. I have worked on high-end residential projects and commercial developments. I take pride in precision, strength, and aesthetic finish. I’m eager to bring my masonry skills to your upcoming projects.",
        time: "12:16",
      },
    ],
  },
]
