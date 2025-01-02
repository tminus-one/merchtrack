# Contributing Guide

Thank you for your interest in contributing to the **MerchTrack Repository**! We welcome contributions from everyone, whether you're fixing a bug, adding a feature, or improving documentation. This guide will help you get started and ensure a smooth collaboration process.

---

## Getting Started

### Prerequisites
Before contributing, ensure you have the following installed:
- **Node.js**: Version `22.18.0` (use `nvm` to manage versions).
- **pnpm**: The package manager used for this project.

### Setup
1. Fork the repository and clone your fork:
   ```sh
   git clone https://github.com/your-username/merchtrack.git
   cd merchtrack
   ```
2. Install dependencies:
   ```sh
   pnpm install
   ```
3. Set up environment variables:
   - Obtain the `.env` file from the project maintainers or create one based on the `.env.example` file.
4. Start the development server:
   ```sh
   pnpm run dev
   ```

---

## Contribution Workflow

### 1. Create a Branch
- Use a descriptive branch name for your changes.
  ```sh
  git checkout -b feature/your-feature-name
  ```
  Example: `feature/add-login`, `fix/order-tracking-bug`.

### 2. Make Changes
- Follow the [coding conventions](#coding-conventions) and [folder structure](#folder-structure) outlined in the repository.
- Write clear and concise commit messages using the [conventional commit format](#commit-messages).

### 3. Test Your Changes
- Ensure your changes do not break existing functionality.
- Write unit tests for new features or bug fixes.
  ```sh
  pnpm test
  ```

### 4. Push Your Changes
- Push your branch to your forked repository:
  ```sh
  git push origin feature/your-feature-name
  ```

### 5. Create a Pull Request (PR)
- Go to the main repository and create a PR from your branch.
- Provide a detailed description of your changes, including:
  - The purpose of the PR.
  - Screenshots or GIFs (if applicable).
  - Steps to test the changes.
- Reference any related issues using keywords like `Closes #123` or `Fixes #456`.

### 6. Review and Iterate
- The maintainers will review your PR and provide feedback.
- Address any requested changes by pushing updates to your branch.

---

## Coding Conventions

### Code Style
- Use **Prettier** and **ESLint** for consistent formatting and linting.
- Run the following commands before committing:
  ```sh
  pnpm format
  pnpm lint
  ```

### Naming
- Use `camelCase` for variables and functions.
  ```javascript
  const userProfile = getUserProfile();
  ```
- Use `PascalCase` for components and types.
  ```typescript
  interface UserProfile {
    name: string;
    age: number;
  }
  ```

### Functions
- Use `function()` for top-level functions.
  ```javascript
  function fetchUserData(userId) {
    // Function logic
  }
  ```
- Use arrow functions for anonymous functions or callbacks.
  ```javascript
  const userData = users.map((user) => user.name);
  ```

### Validation
- Use **Zod** for schema validation.
  ```javascript
  const userSchema = z.object({
    name: z.string(),
    age: z.number().positive(),
  });
  ```

### Error Handling
- Always handle errors gracefully.
  ```javascript
  try {
    const data = await fetchData();
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
  ```

---

## Commit Messages
Follow the conventional commit format:
```
<type>(<scope>): <subject>
```
- **Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- **Scope**: Optional, e.g., `auth`, `order`, `ui`
- **Subject**: A concise description of the change.

Examples:
```
feat(auth): add login functionality
fix(order): resolve tracking bug
docs(readme): update installation instructions
```

---

## Code of Conduct
We are committed to fostering a welcoming and inclusive community. Please read and adhere to our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## Questions?
If you have any questions or need help, feel free to:
- Open an issue on GitHub.
- Reach out to the maintainers at maintainers@merchtrack.tech.

