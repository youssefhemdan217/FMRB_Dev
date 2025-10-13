# Monorepo Setup Documentation

## Overview

This repository is set up as a **monorepo** using **npm workspaces**, containing both the frontend and backend applications in a single repository.

## Structure

```
FMRB_Dev/
├── app/
│   ├── frontend/              # React frontend application
│   │   ├── src/              # Source code
│   │   ├── package.json      # Frontend dependencies
│   │   ├── vite.config.ts    # Vite configuration
│   │   └── ...
│   │
│   └── backend/              # Express backend API
│       ├── src/              # Source code
│       ├── package.json      # Backend dependencies
│       ├── tsconfig.json     # TypeScript configuration
│       └── ...
│
├── package.json              # Root workspace configuration
├── README.md                 # Main documentation
├── QUICKSTART.md            # Quick start guide
└── .gitignore               # Git ignore rules
```

## Benefits of Monorepo

1. **Shared Dependencies**: Common packages can be shared across projects
2. **Consistent Tooling**: Same linting, formatting, and build tools
3. **Atomic Changes**: Make changes to frontend and backend together
4. **Simplified Workflow**: Single repository to clone and manage
5. **Type Sharing**: Share TypeScript types between frontend and backend (future enhancement)

## Workspace Configuration

### Root package.json

The root `package.json` defines the workspaces:

```json
{
  "workspaces": [
    "app/frontend",
    "app/backend"
  ]
}
```

### Workspace Packages

- **@fmrb/frontend** - React frontend (app/frontend)
- **@fmrb/backend** - Express backend (app/backend)

## Working with Workspaces

### Installing Dependencies

```bash
# Install all workspace dependencies
npm install

# Install a package in specific workspace
npm install <package> --workspace=@fmrb/frontend
npm install <package> --workspace=@fmrb/backend

# Install a dev dependency
npm install -D <package> --workspace=@fmrb/frontend
```

### Running Scripts

```bash
# Run script in all workspaces
npm run <script> --workspaces

# Run script in specific workspace
npm run dev --workspace=@fmrb/frontend
npm run dev --workspace=@fmrb/backend

# Or use the convenience scripts from root
npm run dev:frontend
npm run dev:backend
npm run dev  # Runs both concurrently
```

### Adding New Packages

To add a new workspace package:

1. Create directory under `app/`
2. Add `package.json` with a scoped name (`@fmrb/package-name`)
3. Add the path to root `package.json` workspaces array
4. Run `npm install` from root

## Development Workflow

### 1. Initial Setup

```bash
# Clone repository
git clone <repo-url>
cd FMRB_Dev

# Install all dependencies
npm install

# Setup environment files
cd app/backend
cp .env.example .env
cd ../..
```

### 2. Development

```bash
# Start both servers
npm run dev

# Or individually
npm run dev:frontend  # http://localhost:5173
npm run dev:backend   # http://localhost:3000
```

### 3. Building

```bash
# Build all
npm run build

# Or individually
npm run build:frontend
npm run build:backend
```

### 4. Production

```bash
# Frontend
cd app/frontend
npm run build
npm run preview

# Backend
cd app/backend
npm run build
npm start
```

## Best Practices

### 1. Dependency Management

- Keep shared dependencies at the root level when possible
- Use workspace-specific dependencies only when needed
- Regularly update dependencies: `npm update --workspaces`

### 2. Versioning

- Maintain consistent version numbers across workspaces
- Use semantic versioning
- Update all workspace versions together for releases

### 3. Git Workflow

- Commit changes to both frontend and backend together
- Use conventional commits: `feat(frontend):`, `fix(backend):`, etc.
- Create feature branches for new features

### 4. Type Sharing (Future)

Consider creating a shared types package:

```
app/
  ├── frontend/
  ├── backend/
  └── shared/           # @fmrb/shared
      └── types/        # Shared TypeScript types
```

## Troubleshooting

### Issue: Workspace not found

**Solution**: Run `npm install` from the root directory

### Issue: Dependencies not resolving

**Solution**: 
```bash
rm -rf node_modules app/*/node_modules
rm package-lock.json
npm install
```

### Issue: Port conflicts

**Solution**: 
- Backend: Change `PORT` in `app/backend/.env`
- Frontend: Vite will auto-increment to next available port

### Issue: CORS errors

**Solution**: Update `CORS_ORIGIN` in `app/backend/.env` to match frontend URL

## Scripts Reference

| Command | Description |
|---------|-------------|
| `npm install` | Install all workspace dependencies |
| `npm run dev` | Start both frontend and backend |
| `npm run dev:frontend` | Start frontend only |
| `npm run dev:backend` | Start backend only |
| `npm run build` | Build all workspaces |
| `npm run build:frontend` | Build frontend only |
| `npm run build:backend` | Build backend only |
| `npm run lint` | Lint all workspaces |
| `npm run test` | Run tests in all workspaces |
| `npm run clean` | Clean build artifacts |

## Additional Resources

- [npm workspaces documentation](https://docs.npmjs.com/cli/v9/using-npm/workspaces)
- [Monorepo best practices](https://monorepo.tools/)
- Project README: [README.md](./README.md)
- Quick Start: [QUICKSTART.md](./QUICKSTART.md)
- Architecture: [ARCHITECTURE.md](./ARCHITECTURE.md)

