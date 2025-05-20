# BookKeep

BookKeep is a modern web application for managing your personal book collection. Built with React, TypeScript, and Material-UI, it provides a beautiful and intuitive interface for tracking your books.

🔗 **[Live Demo](https://bookkeep-web.home.infernos.co.za/)**

## Features

- 📚 Manage your book collection with ease
- 🎨 Beautiful, responsive UI with both card and table views
- 📱 Mobile-friendly design
- ✨ Real-time form validation
- 🔍 ISBN validation and formatting
- 🖼️ Book cover image support (with automatic OpenLibrary.org integration)
- 📋 Comprehensive book details including:
  - Title
  - Author
  - ISBN
  - Publication Year
  - Genre
  - Description
  - Cover Image (automatically fetched from OpenLibrary.org if not provided)

## Demo

Try out BookKeep without installing! Visit our [live demo](https://bookkeep-web.home.infernos.co.za/) to explore all features and see the application in action.

## Tech Stack

- **Frontend Framework**: React 19
- **Language**: TypeScript
- **UI Framework**: Material-UI v7
- **State Management**: TanStack Query (React Query) v5
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Routing**: React Router v7 with vite-plugin-pages (file-based routing)
- **Notifications**: Notistack
- **Build Tool**: Vite
- **Package Manager**: npm/yarn

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- A running instance of the BookKeep API server (available at [BookKeepAPI](https://github.com/imbavirus/BookKeepAPI))

## Related Repositories

- [BookKeepAPI](https://github.com/imbavirus/BookKeepAPI) - The backend API server for BookKeep

## Environment Setup

A `.env.example` file is provided in the repository as a template. Copy it to create your own `.env` file:

```bash
cp .env.example .env
```

Then modify the values in `.env` according to your setup:

```env
VITE_API_BASE_URL=http://localhost:5001
```

Make sure to never commit your actual `.env` file to version control.

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/BookKeep.git
cd BookKeep/BookKeepWeb
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up the API server:
   - Clone and set up the [BookKeepAPI](https://github.com/imbavirus/BookKeepAPI) repository
   - Follow the API setup instructions in its README
   - Make sure the API is running before starting the web application

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

To preview the production build:

```bash
npm run preview
# or
yarn preview
```

## Project Structure

```
src/
├── @types/           # TypeScript type definitions
├── components/       # Reusable React components
├── pages/            # Page components and file-based routing
│   ├── index.tsx        # Home page route (/)
│   ├── books/           # Book-related routes
│   │   ├── index.tsx       # Books list route (/books)
│   │   ├── new/            # New book route (/books/new)
│   │   ├── [id].tsx        # Book details route (/books/:id)
│   │   └── edit/[id].tsx   # Edit book route (/books/edit/:id)
├── services/         # API services and business logic
└── main.tsx          # Application entry point
```

The project uses `vite-plugin-pages` for file-based routing, which automatically generates routes based on the file structure in the `pages` directory. This provides a clean, convention-based routing approach similar to Next.js.

## Key Features Implementation

### Book Management

- **Create**: Add new books with comprehensive details
- **Read**: View books in either card or table format
- **Update**: Edit existing book information
- **Delete**: Remove books from your collection

### Data Validation

- Real-time form validation using Zod
- ISBN format validation (supports both ISBN-10 and ISBN-13)
- Required field validation
- Data type validation

### UI/UX Features

- Responsive design that works on all devices
- Card view for visual browsing
- Table view for detailed information
- Loading states and error handling
- Toast notifications for user feedback
- Confirmation dialogs for destructive actions
- Automatic book cover images from OpenLibrary.org when not manually provided

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0) - see the [LICENSE](LICENSE) file for details.

This means you are free to:
- Use this software for any purpose
- Change the software to suit your needs
- Share the software with your friends and neighbors
- Share the changes you make

Under the following conditions:
- If you distribute this software, you must include the source code
- Any modifications must also be under the GPL-3.0 license
- You must state significant changes made to the software
- Include the original license and copyright notices

For more information about the GPL-3.0 license, visit [GNU GPL v3](https://www.gnu.org/licenses/gpl-3.0.en.html).

## Acknowledgments

- Material-UI for the beautiful component library
- TanStack Query for excellent data management
- React Hook Form for form handling
- Notistack for toast notifications
- Zod for robust validation
