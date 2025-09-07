export default {
    template: `
    <div class="container-fluid py-4">
        <!-- Loading Spinner -->
        <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border" role="status" style="color: #000000;">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2" style="color: #333333;">Loading your dashboard...</p>
        </div>
        <!-- Welcome Header -->
        <div v-else>
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="card border-2 border-dark shadow-sm bg-gradient-primary text-white">
                            <div class="card-body">
                                <div class="row align-items-center">
                                    <div class="col-md-8">
                                        <h1 class="card-title mb-2" style="color: #ffffff;">
                                            <i class="fas fa-user-circle me-2"></i>
                                             Welcome back, {{ displayName }}! 👋
                                        </h1>
                                        <p class="card-text mb-0" style="color: #ffffff;">
                                            Ready to test your knowledge? Let's see how you're doing today!
                                        </p>
                                    </div>
                                    <div class="col-md-4 text-end">
                                        <div class="d-flex justify-content-end">
                                            <div class="text-center me-4">
                                                <h3 class="mb-0" style="color: #ffffff;">{{ userStats.totalQuizzes }}</h3>
                                                <small style="color: #ffffff;">Quizzes Taken</small>
                                            </div>
                                            <div class="text-center">
                                                <h3 class="mb-0" style="color: #ffffff;">{{ userStats.averageScore }}%</h3>
                                                <small style="color: #ffffff;">Average Score</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        
                <!-- Stats Cards Row -->
                <div class="row mb-4">
                    <div class="col-lg-3 col-md-6 mb-3">
                        <div class="card border-0 shadow-sm h-100">
                            <div class="card-body text-center">
                                <div class="text-primary mb-2">
                                    <i class="fas fa-trophy fa-2x"></i>
                                </div>
                                <h4 class="card-title text-primary">{{ userStats.highestScore }}%</h4>
                                <p class="card-text text-muted">Highest Score</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6 mb-3">
                        <div class="card border-0 shadow-sm h-100">
                            <div class="card-body text-center">
                                <div class="text-success mb-2">
                                    <i class="fas fa-chart-line fa-2x"></i>
                                </div>
                                <h4 class="card-title text-success">{{ userStats.totalPoints }}</h4>
                                <p class="card-text text-muted">Total Points</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6 mb-3">
                        <div class="card border-0 shadow-sm h-100">
                            <div class="card-body text-center">
                                <div class="text-warning mb-2">
                                    <i class="fas fa-medal fa-2x"></i>
                                </div>
                                <h4 class="card-title text-warning">{{ userStats.rank }}</h4>
                                <p class="card-text text-muted">Current Rank</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6 mb-3">
                        <div class="card border-0 shadow-sm h-100">
                            <div class="card-body text-center">
                                <div class="text-info mb-2">
                                    <i class="fas fa-calendar-check fa-2x"></i>
                                </div>
                                <h4 class="card-title text-info">{{ userStats.streak }}</h4>
                                <p class="card-text text-muted">Day Streak</p>
                            </div>
                        </div>
                    </div>
                </div>
        
                <!-- Main Content Row -->
                <div class="row">
                    <!-- Left Column - Recent Activity & Quick Actions -->
                    <div class="col-lg-8">
                        <!-- Recent Quiz History -->
                        <div class="card border-0 shadow-sm mb-4">
                            <div class="card-header bg-white border-0">
                                <h5 class="card-title mb-0">
                                    <i class="fas fa-history me-2 text-primary"></i>
                                    Recent Quiz History
                                </h5>
                            </div>
                            <div class="card-body">
                                <div v-if="recentQuizzes.length" class="table-responsive">
                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Quiz</th>
                                                <th>Score</th>
                                                <th>Date</th>
                                                <th>Duration</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="quiz in recentQuizzes" :key="quiz.id">
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <i class="fas fa-question-circle text-primary me-2"></i>
                                                        <span class="fw-bold">{{ quiz.title }}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span class="badge" :class="getScoreBadgeClass(quiz.score)">
                                                        {{ quiz.score }}%
                                                    </span>
                                                </td>
                                                <td>{{ formatDate(quiz.completedAt) }}</td>
                                                <td>{{ quiz.duration }}m</td>
                                                <td>
                                                    <span class="badge" :class="quiz.status === 'completed' ? 'bg-success' : 'bg-warning'">
                                                        {{ quiz.status }}
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div v-else class="text-center py-4">
                                    <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                                    <p class="text-muted">No quiz history yet. Start your first quiz!</p>
                                </div>
                            </div>
                        </div>
        
                        <!-- Available Quizzes -->
                        <div class="card border-0 shadow-sm">
                            <div class="card-header bg-white border-0">
                                <h5 class="card-title mb-0">
                                    <i class="fas fa-play-circle me-2 text-success"></i>
                                    Available Quizzes
                                </h5>
                            </div>
                            <div class="card-body">
                                <div v-if="availableQuizzes.length" class="row">
                                    <div v-for="quiz in availableQuizzes.slice(0, 3)" :key="quiz.id" class="col-md-4 mb-3">
                                        <div class="card border-0 shadow-sm h-100">
                                            <div class="card-body text-center">
                                                <h6 class="card-title">{{ quiz.title }}</h6>
                                                <p class="card-text text-muted small">{{ quiz.duration }} minutes</p>
                                                <button class="btn btn-primary btn-sm" @click="startQuiz(quiz)">
                                                    <i class="fas fa-play me-1"></i>Start
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-else class="text-center py-4">
                                    <i class="fas fa-clock fa-3x text-muted mb-3"></i>
                                    <p class="text-muted">No quizzes available at the moment.</p>
                                </div>
                                <div class="text-center mt-3">
                                    <router-link to="/dashboard" class="btn btn-outline-primary">
                                        <i class="fas fa-list me-1"></i>View All Quizzes
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </div>
        
                    <!-- Right Column - Quick Actions & Performance -->
                    <div class="col-lg-4">
                        <!-- Quick Actions -->
                        <div class="card border-0 shadow-sm mb-4">
                            <div class="card-header bg-white border-0">
                                <h5 class="card-title mb-0">
                                    <i class="fas fa-bolt me-2 text-warning"></i>
                                    Quick Actions
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="d-grid gap-2">
                                    <router-link to="/dashboard" class="btn btn-primary">
                                        <i class="fas fa-play me-2"></i>Take a Quiz
                                    </router-link>
                                    <router-link :to="'/scores/' + userId" class="btn btn-outline-success">
                                        <i class="fas fa-chart-bar me-2"></i>View Scores
                                    </router-link>
                                    <router-link :to="'/summary/' + userId" class="btn btn-outline-info">
                                        <i class="fas fa-analytics me-2"></i>Performance Summary
                                    </router-link>
                                    <router-link to="/payment" class="btn btn-outline-warning">
                                        <i class="fas fa-credit-card me-2"></i>Payment
                                    </router-link>
                                </div>
                            </div>
                        </div>
        
                        <!-- Performance Chart -->
                        <div class="card border-0 shadow-sm mb-4">
                            <div class="card-header bg-white border-0">
                                <h5 class="card-title mb-0">
                                    <i class="fas fa-chart-pie me-2 text-info"></i>
                                    Performance Overview
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="text-center">
                                    <div class="mb-3">
                                        <div class="progress" style="height: 20px;">
                                            <div class="progress-bar bg-success" role="progressbar" 
                                                 :style="{width: userStats.averageScore + '%'}" 
                                                 :aria-valuenow="userStats.averageScore" 
                                                 aria-valuemin="0" aria-valuemax="100">
                                                {{ userStats.averageScore }}%
                                            </div>
                                        </div>
                                        <small class="text-muted">Average Performance</small>
                                    </div>
                                    
                                    <div class="row text-center">
                                        <div class="col-6">
                                            <h6 class="text-success">{{ userStats.correctAnswers }}</h6>
                                            <small class="text-muted">Correct</small>
                                        </div>
                                        <div class="col-6">
                                            <h6 class="text-danger">{{ userStats.incorrectAnswers }}</h6>
                                            <small class="text-muted">Incorrect</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
        
                        <!-- Achievements -->
                        <div class="card border-0 shadow-sm">
                            <div class="card-header bg-white border-0">
                                <h5 class="card-title mb-0">
                                    <i class="fas fa-trophy me-2 text-warning"></i>
                                    Recent Achievements
                                </h5>
                            </div>
                            <div class="card-body">
                                <div v-if="achievements.length">
                                    <div v-for="achievement in achievements.slice(0, 3)" :key="achievement.id" 
                                         class="d-flex align-items-center mb-3">
                                        <div class="me-3">
                                            <i :class="achievement.icon" :style="{color: achievement.color}"></i>
                                        </div>
                                        <div>
                                            <h6 class="mb-1">{{ achievement.title }}</h6>
                                            <small class="text-muted">{{ achievement.description }}</small>
                                        </div>
                                    </div>
                                </div>
                                <div v-else class="text-center py-3">
                                    <i class="fas fa-star fa-2x text-muted mb-2"></i>
                                    <p class="text-muted small">Complete quizzes to earn achievements!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    </div>
    `,
    
    data() {
        return {
            isLoading: true,
            userId: null,
            userInfo: {
                name: localStorage.getItem('username') || '',
                email: '',
                joinDate: ''
            },
            userStats: {
                totalQuizzes: 0,
                averageScore: 0,
                highestScore: 0,
                totalPoints: 0,
                rank: 0,
                streak: 0,
                correctAnswers: 0,
                incorrectAnswers: 0
            },
            recentQuizzes: [],
            availableQuizzes: [],
            achievements: []
        };
    },
    computed: {
        displayName() {
            return this.userInfo.name || localStorage.getItem('username') || 'User';
        }
    },
    methods: {
        async fetchUserData() {
            try {
                this.isLoading = true;
                const token = localStorage.getItem('auth_token');
                const userId = localStorage.getItem('userId');
                
                if (!token || !userId) {
                    this.$router.push('/login');
                    return;
                }
                
                this.userId = userId;
                
                // Fetch user profile
                const userResponse = await fetch(`/api/user/${userId}`, {
                    headers: {
                        'Authentication-Token': token,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    console.log("Backend Response:", userData);
                    this.userInfo = {
                        name: userData.name,
                        email: userData.email,
                        joinDate: userData.joinDate
                    };
                }
                // Fetch user statistics
                await this.fetchUserStats();
                
                // Fetch recent quiz history
                await this.fetchRecentQuizzes();
                
                // Fetch available quizzes
                await this.fetchAvailableQuizzes();
                
                // Fetch achievements
                await this.fetchAchievements();
                
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                this.isLoading = false;
            }
        },
        
        async fetchUserStats() {
            try {
                const response = await fetch(`/api/user/${this.userId}/stats`, {
                    headers: {
                        'Authentication-Token': localStorage.getItem('auth_token'),
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    const stats = await response.json();
                    this.userStats = { ...this.userStats, ...stats };
                }
            } catch (error) {
                console.error('Error fetching user stats:', error);
            }
        },
        
        async fetchRecentQuizzes() {
            try {
                const response = await fetch(`/api/user/${this.userId}/quiz-history?limit=5`, {
                    headers: {
                        'Authentication-Token': localStorage.getItem('auth_token'),
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    this.recentQuizzes = await response.json();
                }
            } catch (error) {
                console.error('Error fetching recent quizzes:', error);
            }
        },
        
        async fetchAvailableQuizzes() {
            try {
                const response = await fetch('/api/getquiz', {
                    headers: {
                        'Authentication-Token': localStorage.getItem('auth_token'),
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    const quizzes = await response.json();
                    this.availableQuizzes = Array.isArray(quizzes) ? quizzes : [];
                }
            } catch (error) {
                console.error('Error fetching available quizzes:', error);
            }
        },
        
        async fetchAchievements() {
            try {
                const response = await fetch(`/api/user/${this.userId}/achievements`, {
                    headers: {
                        'Authentication-Token': localStorage.getItem('auth_token'),
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    this.achievements = await response.json();
                } else {
                    // Mock achievements if API doesn't exist
                    this.achievements = [
                        {
                            id: 1,
                            title: "First Quiz",
                            description: "Completed your first quiz",
                            icon: "fas fa-star",
                            color: "#ffc107"
                        },
                        {
                            id: 2,
                            title: "High Scorer",
                            description: "Scored above 80%",
                            icon: "fas fa-trophy",
                            color: "#28a745"
                        }
                    ];
                }
            } catch (error) {
                console.error('Error fetching achievements:', error);
            }
        },
        
        startQuiz(quiz) {
            if (!quiz || !quiz.id || !quiz.duration) {
                console.error('Quiz ID or duration is missing!');
                return;
            }
            
            this.$router.push({ 
                path: `/quiz/${quiz.id}`, 
                query: { duration: quiz.duration }
            });
        },
        
        getScoreBadgeClass(score) {
            if (score >= 80) return 'bg-success';
            if (score >= 60) return 'bg-warning';
            return 'bg-danger';
        },
        
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    },
    
    mounted() {
        this.fetchUserData();
    }
};
