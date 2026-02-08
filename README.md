<<<<<<< HEAD
# Expense Tracker - Angular Frontend

A modern, responsive Angular frontend for the Expense Tracker application, fully integrated with the Spring Boot backend.

## Features

- ✅ User Authentication (Signup & Login)
- ✅ Dashboard with Expense Summary
- ✅ Create, Read, Update, Delete Expenses
- ✅ Filter Expenses by:
  - Type (Personal/Organizational)
  - Date Range
  - Category
- ✅ Real-time Expense Statistics
- ✅ Responsive Design
- ✅ Form Validation
- ✅ Route Guards for Protected Routes

## Tech Stack

- **Angular**: 17.1.0
- **TypeScript**: 5.3.2
- **RxJS**: 7.8.0
- **Angular Router**: For navigation
- **Angular Forms**: Reactive forms with validation
- **HttpClient**: For API communication

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── login/                 # Login component
│   │   ├── signup/                # Signup component
│   │   ├── dashboard/             # Main dashboard
│   │   └── expense-form/          # Add/Edit expense form
│   ├── services/
│   │   ├── auth.service.ts        # Authentication service
│   │   ├── expense.service.ts     # Expense CRUD operations
│   │   └── category.service.ts    # Category service
│   ├── models/
│   │   ├── user.model.ts          # User interface
│   │   ├── expense.model.ts       # Expense interface
│   │   ├── category.model.ts      # Category interface
│   │   ├── request.model.ts       # Request DTOs
│   │   ├── expense-type.enum.ts   # ExpenseType enum
│   │   └── category-applicable-to.enum.ts
│   ├── guards/
│   │   └── auth.guard.ts          # Route protection
│   ├── app-routing.module.ts      # Routes configuration
│   ├── app.module.ts              # Main module
│   └── app.component.ts           # Root component
├── environments/
│   ├── environment.ts             # Development config
│   └── environment.prod.ts        # Production config
├── index.html
├── main.ts
└── styles.css
```

## Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Angular CLI**: 17.x

Install Angular CLI globally:
```bash
npm install -g @angular/cli@17
```

## Installation

1. **Extract the project** (if from ZIP)

2. **Navigate to project directory**
```bash
cd expense-tracker-frontend
```

3. **Install dependencies**
```bash
npm install
```

## Configuration

### Backend API URL

Update the backend URL in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'  // Your Spring Boot backend URL
};
```

For production, update `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com'
};
```

## Running the Application

### Development Server

```bash
npm start
# or
ng serve
```

The application will start at **http://localhost:4200**

### Production Build

```bash
npm run build
# or
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

## Backend Integration

### CORS Configuration (IMPORTANT!)

Add this CORS configuration to your Spring Boot backend:

Create `src/main/java/com/expensetracker/config/WebConfig.java`:

```java
package com.expensetracker.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

**Or** add this to your `application.yml`:

```yaml
spring:
  web:
    cors:
      allowed-origins: "http://localhost:4200"
      allowed-methods: "*"
      allowed-headers: "*"
      allow-credentials: true
```

## Application Features

### 1. Authentication

#### Signup (`/signup`)
- Create new account with username, email, and password
- Client-side validation
- Automatic login after signup

#### Login (`/login`)
- Login with username and password
- Session management with localStorage
- Redirect to dashboard on success

### 2. Dashboard (`/dashboard`)

**Summary Cards:**
- Total Expenses
- Personal Expenses Total
- Organizational Expenses Total

**Filters:**
- Filter by Type (Personal/Organizational)
- Filter by Category
- Filter by Date Range (Start Date - End Date)
- Apply/Clear filter options

**Expense List:**
- View all expenses in table format
- Edit expense (pencil icon)
- Delete expense (trash icon)
- Color-coded badges for expense types

### 3. Add/Edit Expense (`/expense/add`, `/expense/edit/:id`)

**Form Fields:**
- Amount (with decimal support)
- Date
- Description
- Type (Personal/Organizational dropdown)
- Category (dropdown from backend categories)

**Actions:**
- Create new expense
- Update existing expense
- Cancel and return to dashboard

## API Integration

All services are perfectly aligned with the Spring Boot backend:

### AuthService
```typescript
POST /auth/signup    → signup(UserRequest)
POST /auth/login     → login(LoginRequest)
```

### ExpenseService
```typescript
GET    /expenses              → getAllExpenses(userId, filters)
POST   /expenses              → createExpense(ExpenseRequest)
PUT    /expenses/{id}         → updateExpense(id, ExpenseRequest)
DELETE /expenses/{id}         → deleteExpense(id)
GET    /expenses/{id}         → getExpenseById(id)
```

### CategoryService
```typescript
GET /categories → getAllCategories()
```

## Models Alignment

### Frontend ↔️ Backend

| Frontend Model | Backend DTO/Entity |
|---------------|-------------------|
| User | UserResponseDTO |
| Expense | ExpenseResponseDTO |
| Category | Category |
| UserRequest | UserRequestDTO |
| LoginRequest | LoginRequestDTO |
| ExpenseRequest | ExpenseRequestDTO |
| ExpenseType | ExpenseType (enum) |
| CategoryApplicableTo | CategoryApplicableTo (enum) |

## Route Protection

Protected routes require authentication:
- `/dashboard`
- `/expense/add`
- `/expense/edit/:id`

AuthGuard redirects unauthenticated users to `/login`.

## Usage Flow

1. **Start Backend**: Run Spring Boot application on port 8080
2. **Start Frontend**: Run `ng serve` on port 4200
3. **Open Browser**: Navigate to `http://localhost:4200`
4. **Signup**: Create a new account
5. **Dashboard**: View your expenses and summary
6. **Add Expense**: Click "Add Expense" button
7. **Filter**: Use filters to find specific expenses
8. **Edit/Delete**: Manage your expenses

## Development Tips

### Hot Reload
Angular CLI provides hot reload - changes are automatically reflected.

### Debug in Browser
Use Chrome/Firefox DevTools:
- Network tab: Monitor API calls
- Console: View errors and logs
- Application tab: Inspect localStorage

### API Testing
Ensure backend is running before testing frontend features.

## Common Issues & Solutions

### Issue: CORS Error
**Solution**: Add CORS configuration to Spring Boot backend (see above).

### Issue: API Connection Refused
**Solution**: Ensure Spring Boot backend is running on port 8080.

### Issue: Login Fails
**Solution**: Check Network tab for error messages, verify backend is accessible.

### Issue: Expenses Not Loading
**Solution**: Verify userId is correct and backend returns valid response.

## Styling

The application uses custom CSS with:
- Gradient backgrounds
- Card-based layouts
- Responsive design
- Mobile-friendly interface
- Color-coded expense types
- Hover effects and transitions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- [ ] Export expenses to CSV/PDF
- [ ] Charts and graphs for expense visualization
- [ ] Budget tracking and alerts
- [ ] Multi-currency support
- [ ] Dark mode
- [ ] Expense search functionality
- [ ] Pagination for large expense lists

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 4200
npx kill-port 4200
# Or use different port
ng serve --port 4300
```

### Node Modules Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## License

This project is part of the Expense Tracker application suite.

---

**Ready to track your expenses!** 🚀💰
=======
# expense-tracker-frontend
>>>>>>> 31ef5eff6481cbf426867d5195ec45b082a17d72
