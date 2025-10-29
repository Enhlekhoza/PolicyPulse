# PolicyPulse Hackanomics To-Do List

This document outlines the necessary steps to prepare the PolicyPulse application for the Hackanomics submission.

## Phase 1: Critical Bug Fixes & Core Functionality

-   [x] **Fix the Database Schema:**
    -   [x] Modify `backend/prisma/schema.prisma` to change the data type of `parameters` and `results` in the `Simulation` model from `Json` to `String`.
    -   [x] Generate a new database migration using `npx prisma migrate dev --name fix_json_support`.
    -   [x] Update the `saveSimulation` function in `backend/src/models/policyModel.ts` to `JSON.stringify` the `parameters` and `results` before saving them to the database.
    -   [x] Update the `getSimulationHistory` function in `backend/src/controllers/policyController.ts` to `JSON.parse` the `parameters` and `results` after fetching them from the database.

-   [x] **Unify Policy Types:**
    -   [x] Create a central file (e.g., `backend/src/config/policies.ts`) to define the available policy types, their parameters, and their simulation models.
    -   [x] Update the backend to use this central configuration.
    -   [x] Update the frontend components (`PolicySimulator.tsx`, `PolicyComparison.tsx`) to fetch the available policy types from the backend.

-   [x] **Connect Frontend to Backend:**
    -   [x] In `frontend/src/components/PolicySimulator.tsx`, uncomment the `fetch` call and make it work with the backend API. (This file was deleted and its functionality merged into `frontend/src/pages/PolicySimulator.tsx`)
    -   [x] In `frontend/src/pages/PolicySimulator.tsx`, do the same.
    -   [x] Ensure that the simulation results from the backend are correctly displayed in the frontend.

## Phase 2: Feature Enhancement & Polish

-   [x] **Enhance the UBI Simulation Model:**
    -   [x] Research and incorporate more variables into the UBI simulation model in the backend (e.g., inflation, labor force participation).
    -   [x] Update the frontend to display these new variables.

-   [x] **Improve the User Interface:**
    -   [x] Merge the two `PolicySimulator.tsx` components into a single, more comprehensive simulator.
    -   [x] Improve the visualizations in the `PolicyComparison.tsx` component to make it easier to compare scenarios.

-   [x] **Implement User Authentication:**
    -   [x] Ensure that the `getSimulationHistory` endpoint is protected and only returns the simulations for the currently logged-in user.
    -   [x] Add a login/register page to the frontend.

## Phase 3: Documentation & Submission Prep

-   [x] **Create a `PITCH_DECK.md`:**
    -   [x] Create a markdown file with content for a pitch deck, including a script for each slide.

-   [x] **Update the `README.md`:**
    -   [x] Update the `README.md` to reflect the current state of the project, including the new features and a clear description of how to run the application. Adapt content from the `PITCH_DECK.md`.

-   [ ] **Final Testing and Bug Fixing:**
    -   [ ] Thoroughly test the entire application and fix any remaining bugs.