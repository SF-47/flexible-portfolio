using System.Text.Json;
using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Data.Seeders;

public static class SectionContentSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        var defaultContent = new Dictionary<string, object>
        // A dictionary lets us associate every section type with its own content structure.
        {
            ["hero"] = new
            {
                tagline = "ATLAS CONSTRUCTION",
                title = "Building Tomorrow, Today",
                description = "Professional construction solutions.",
                buttonText = "Explore Our Projects",
                buttonLink = "#projects",
            },
            ["about"] = new
            {
                label = "About Us",
                title = "Building Excellence for Over 20 Years",
                description = "ATLAS Construction is a leading construction and engineering company committed to delivering high-quality projects that stand the test of time.",
                secondDescription = "From residential buildings to large-scale commercial developments, we combine innovation, expertise, and craftsmanship to bring every vision to life.",
                linkText = "Discover Our Services",
                linkUrl = "#services",
                imageMediaId = (int?)null,
                imageAlt = "Construction project",
            },
            ["stats"] = new
            {
                items = new[]
                {
                    new { value = "20+", label = "Years of Experience" },
                    new { value = "250+", label = "Completed Projects" },
                    new { value = "180+", label = "Happy Clients" },
                    new { value = "45+", label = "Team Members" },
                },
            },
            ["services"] = new
            {
                label = "What We Do",
                title = "Our Services",
                description = "We offer comprehensive construction and engineering solutions tailored to meet the needs of every project.",
            },
            ["projects"] = new { label = "Our Portfolio", title = "Featured Projects" },
            ["whyChooseUs"] = new
            {
                label = "Our Advantages",
                title = "Why Choose Us",
                description = "We deliver more than buildings. We create lasting value through expertise, dedication, and attention to detail.",
                items = new[]
                {
                    new
                    {
                        icon = "ShieldCheck",
                        title = "Safety First",
                        description = "We maintain high safety standards across every stage of construction.",
                    },
                    new
                    {
                        icon = "Award",
                        title = "Quality Craftsmanship",
                        description = "Our commitment to quality ensures durable and exceptional results.",
                    },
                    new
                    {
                        icon = "Clock3",
                        title = "On-Time Delivery",
                        description = "We plan and execute projects efficiently to meet agreed timelines.",
                    },
                    new
                    {
                        icon = "Users",
                        title = "Experienced Team",
                        description = "Our professionals bring technical expertise and practical experience.",
                    },
                    new
                    {
                        icon = "BadgeCheck",
                        title = "Trusted Partnerships",
                        description = "We build long-term relationships through transparency and reliability.",
                    },
                    new
                    {
                        icon = "Lightbulb",
                        title = "Innovative Solutions",
                        description = "We combine modern methods and creative thinking to solve challenges.",
                    },
                },
            },
            ["process"] = new
            {
                label = "Our Workflow",
                title = "How We Work",
                description = "Our structured approach ensures clarity, collaboration, and quality throughout every stage of your project.",
                steps = new[]
                {
                    new
                    {
                        number = "01",
                        icon = "MessagesSquare",
                        title = "Initial Consultation",
                        description = "We discuss your vision, requirements, budget, and project objectives.",
                    },
                    new
                    {
                        number = "02",
                        icon = "PencilRuler",
                        title = "Design & Planning",
                        description = "Our specialists develop concepts, plans, and technical solutions.",
                    },
                    new
                    {
                        number = "03",
                        icon = "ClipboardList",
                        title = "Project Preparation",
                        description = "We organize schedules, resources, materials, and project requirements.",
                    },
                    new
                    {
                        number = "04",
                        icon = "HardHat",
                        title = "Construction",
                        description = "Our experienced teams execute the project with precision and care.",
                    },
                    new
                    {
                        number = "05",
                        icon = "ClipboardCheck",
                        title = "Quality Inspection",
                        description = "We review the completed work to ensure it meets our quality standards.",
                    },
                    new
                    {
                        number = "06",
                        icon = "KeyRound",
                        title = "Project Handover",
                        description = "We deliver the completed project and provide final documentation.",
                    },
                },
            },
            ["gallery"] = new
            {
                label = "Visual Showcase",
                title = "Our Gallery",
                description = "Explore our collection of architectural designs, construction details, and completed spaces.",
                icon = "Images",
                items = new[]
                {
                    new
                    {
                        title = "Modern Residential Architecture",
                        category = "Residential",
                        imageMediaId = (int?)null,
                        featured = true,
                    },
                    new
                    {
                        title = "Contemporary Office Interior",
                        category = "Commercial",
                        imageMediaId = (int?)null,
                        featured = false,
                    },
                    new
                    {
                        title = "Architectural Exterior",
                        category = "Architecture",
                        imageMediaId = (int?)null,
                        featured = false,
                    },
                    new
                    {
                        title = "Modern Living Space",
                        category = "Interior Design",
                        imageMediaId = (int?)null,
                        featured = false,
                    },
                    new
                    {
                        title = "Commercial Architecture",
                        category = "Construction",
                        imageMediaId = (int?)null,
                        featured = false,
                    },
                },
            },
            ["team"] = new
            {
                label = "Our People",
                title = "Meet Our Team",
                description = "Our strength comes from dedicated professionals who bring experience, creativity, and commitment to every project.",
                members = new[]
                {
                    new
                    {
                        name = "Michael Anderson",
                        position = "Chief Executive Officer",
                        description = "Leading the company's vision and long-term strategic growth.",
                        imageMediaId = (int?)null,
                    },
                    new
                    {
                        name = "David Mitchell",
                        position = "Head of Engineering",
                        description = "Overseeing technical excellence and engineering solutions.",
                        imageMediaId = (int?)null,
                    },
                    new
                    {
                        name = "James Wilson",
                        position = "Senior Project Manager",
                        description = "Coordinating project delivery and maintaining quality standards.",
                        imageMediaId = (int?)null,
                    },
                    new
                    {
                        name = "Robert Carter",
                        position = "Lead Architect",
                        description = "Creating innovative and functional architectural designs.",
                        imageMediaId = (int?)null,
                    },
                },
            },
            ["clients"] = new
            {
                label = "Our Network",
                title = "Clients & Partners",
                description = "We value the relationships we build with organizations that share our commitment to quality and excellence.",
                items = new[]
                {
                    new { name = "Urban Development", icon = "Building2" },
                    new { name = "Capital Group", icon = "Landmark" },
                    new { name = "Industrial Solutions", icon = "Factory" },
                    new { name = "Grand Hospitality", icon = "Hotel" },
                    new { name = "Logistics Partners", icon = "Warehouse" },
                    new { name = "Business Alliance", icon = "BriefcaseBusiness" },
                },
            },
            ["testimonials"] = new
            {
                label = "Client Feedback",
                title = "What Our Clients Say",
                description = "Building strong relationships is just as important as building exceptional spaces.",
                items = new[]
                {
                    new
                    {
                        name = "Ahmad Hassan",
                        role = "Residential Client",
                        initials = "AH",
                        rating = 5,
                        message = "The team demonstrated exceptional professionalism throughout our residential project. Their attention to detail and communication made the entire process smooth.",
                    },
                    new
                    {
                        name = "Omar Khalil",
                        role = "Business Owner",
                        initials = "OK",
                        rating = 5,
                        message = "From planning to final delivery, the quality of work exceeded our expectations. We appreciated their commitment to deadlines and transparency.",
                    },
                    new
                    {
                        name = "Karim Mansour",
                        role = "Property Developer",
                        initials = "KM",
                        rating = 5,
                        message = "A reliable construction partner with excellent technical knowledge. The team understood our requirements and delivered impressive results.",
                    },
                },
            },
            ["certifications"] = new
            {
                label = "Our Standards",
                title = "Certifications & Recognition",
                description = "We believe in maintaining high professional standards, responsible practices, and continuous improvement.",
                items = new[]
                {
                    new
                    {
                        icon = "BadgeCheck",
                        title = "Quality Management",
                        subtitle = "Quality Standards",
                        description = "A strong focus on consistent processes and quality across all projects.",
                    },
                    new
                    {
                        icon = "ShieldCheck",
                        title = "Safety Excellence",
                        subtitle = "Workplace Safety",
                        description = "Commitment to safe working environments and responsible practices.",
                    },
                    new
                    {
                        icon = "Award",
                        title = "Engineering Expertise",
                        subtitle = "Professional Standards",
                        description = "Technical knowledge and professional engineering practices.",
                    },
                    new
                    {
                        icon = "Trophy",
                        title = "Project Excellence",
                        subtitle = "Industry Recognition",
                        description = "Dedication to delivering successful and high-quality projects.",
                    },
                    new
                    {
                        icon = "Medal",
                        title = "Reliable Execution",
                        subtitle = "Operational Excellence",
                        description = "Structured project management and disciplined delivery.",
                    },
                    new
                    {
                        icon = "FileCheck2",
                        title = "Quality Assurance",
                        subtitle = "Project Verification",
                        description = "Thorough reviews and inspections throughout construction.",
                    },
                },
            },
            ["faq"] = new
            {
                label = "Common Questions",
                title = "Frequently Asked Questions",
                description = "Find answers to common questions about our services, project process, and construction solutions.",
                helpIcon = "HelpCircle",
                helpTitle = "Have another question?",
                helpLinkText = "Contact our team",
                helpLinkUrl = "#contact",
                items = new[]
                {
                    new
                    {
                        question = "What types of construction projects do you handle?",
                        answer = "We specialize in residential, commercial, and industrial construction, as well as renovation and engineering services.",
                    },
                    new
                    {
                        question = "How can I request a project quotation?",
                        answer = "Contact our team with your project requirements, location, and estimated timeline. We will review the details and discuss the next steps.",
                    },
                    new
                    {
                        question = "Do you provide architectural design services?",
                        answer = "Yes. Our team supports project planning, architectural design, engineering coordination, and construction execution.",
                    },
                    new
                    {
                        question = "How long does a typical construction project take?",
                        answer = "Project duration depends on the size, complexity, approvals, and scope of work. We provide an estimated schedule during planning.",
                    },
                    new
                    {
                        question = "Can you manage an entire project from start to finish?",
                        answer = "Yes. We offer comprehensive project management covering planning, coordination, construction, and final delivery.",
                    },
                },
            },
            ["cta"] = new
            {
                label = "Start Your Project",
                title = "Have a Vision? Let's Build It Together.",
                description = "Whether you are planning a new development or transforming an existing space, our team is ready to bring your ideas to life.",
                primaryButtonText = "Get In Touch",
                primaryButtonLink = "#contact",
                secondaryButtonText = "Our Services",
                secondaryButtonLink = "#services",
            },
            ["contact"] = new
            {
                label = "Get In Touch",
                title = "Let's Build Something Great",
                description = "Have a project in mind? Contact our team and let's discuss how we can bring your vision to life.",
                addressTitle = "Our Office",
                phoneTitle = "Call Us",
                emailTitle = "Email Us",
                nameLabel = "Full Name",
                namePlaceholder = "Your name",
                emailLabel = "Email Address",
                emailPlaceholder = "you@example.com",
                messageLabel = "Your Message",
                messagePlaceholder = "Tell us about your project...",
                buttonText = "Send Message",
            },
        };

        var sections = await context
            .Sections.Where(section => defaultContent.Keys.Contains(section.Type))
            .ToListAsync();

        var updated = false;

        foreach (var section in sections)
        {
            if (
                !string.IsNullOrWhiteSpace(section.ContentJson)
                && section.ContentJson.Trim() != "{}"
            )
                continue;

            section.ContentJson = JsonSerializer.Serialize(defaultContent[section.Type]);
            section.UpdatedAt = DateTime.UtcNow;
            updated = true;
        }

        if (updated)
            await context.SaveChangesAsync();
    }
}
