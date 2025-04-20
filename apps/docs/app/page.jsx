import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            NestJS Turbo Documentation
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A powerful monorepo template for building scalable NestJS applications with Turborepo.
            Streamline your development workflow and boost productivity.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/docs/getting-started"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/docs/architecture"
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              View Architecture
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="text-xl font-semibold mb-3">Monorepo Architecture</h3>
              <p className="text-gray-600">
                Built with Turborepo for efficient monorepo management, enabling shared code and dependencies across multiple applications.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="text-xl font-semibold mb-3">NestJS Integration</h3>
              <p className="text-gray-600">
                Leverage the power of NestJS framework with TypeScript support, dependency injection, and modular architecture.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="text-xl font-semibold mb-3">Development Tools</h3>
              <p className="text-gray-600">
                Includes pre-configured tools for testing, linting, and building, with optimized development workflows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Quick Start
          </h2>
          <div className="bg-gray-800 rounded-lg p-6 text-white font-mono">
            <pre className="overflow-x-auto">
              <code>
                {`# Clone the repository
git clone https://github.com/vndevteam/nestjs-turbo.git

# Install dependencies
cd nestjs-turbo
pnpm install

# Start development
pnpm dev`}
              </code>
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}

