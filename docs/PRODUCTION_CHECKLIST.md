# Production Launch Checklist

**Quick Reference Checklist for Production Deployment**

---

## Pre-Deployment (Week 1)

### Infrastructure
- [ ] Production Supabase project created
- [ ] Production database migrations run
- [ ] Storage buckets configured (agent-knowledge, agent-exports)
- [ ] RLS policies verified on production
- [ ] Connection pooling configured
- [ ] Automated backups enabled

### Deployment Platform
- [ ] Vercel production project created
- [ ] Environment variables configured
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] CDN enabled

### Security
- [ ] All API keys rotated for production
- [ ] Service role key secured (never exposed client-side)
- [ ] Rate limiting implemented
- [ ] Security headers configured
- [ ] CSP headers configured
- [ ] Input validation on all endpoints

### Monitoring
- [ ] Sentry configured and tested
- [ ] Error tracking working
- [ ] Performance monitoring (Web Vitals) active
- [ ] Health check endpoint created (`/api/health`)
- [ ] Logging infrastructure configured
- [ ] Alerts configured for critical errors

### Testing
- [ ] All unit tests passing
- [ ] All E2E tests passing
- [ ] Load testing completed
- [ ] Security audit completed
- [ ] Performance benchmarks met (<2s page load)

### CI/CD
- [ ] GitHub Actions workflow configured
- [ ] Automated tests run on PR
- [ ] Automated deployment to staging
- [ ] Manual approval for production deploy
- [ ] Rollback procedure documented

---

## Deployment Day

### Pre-Deploy
- [ ] All team members notified
- [ ] Support channels ready
- [ ] Rollback plan reviewed
- [ ] Database backup taken
- [ ] Monitoring dashboards open

### Deploy
- [ ] Deploy to production
- [ ] Verify health check endpoint
- [ ] Test critical user flows
- [ ] Monitor error rates
- [ ] Check performance metrics

### Post-Deploy
- [ ] Verify all features working
- [ ] Check database connections
- [ ] Verify file uploads working
- [ ] Test authentication flow
- [ ] Monitor for 1 hour

---

## Post-Launch (Week 1)

### Daily Monitoring
- [ ] Check error rates
- [ ] Review performance metrics
- [ ] Monitor API usage (OpenAI, Supabase)
- [ ] Check storage usage
- [ ] Review user feedback

### Week 1 Tasks
- [ ] Daily standup to review issues
- [ ] Fix critical bugs immediately
- [ ] Collect user feedback
- [ ] Monitor costs
- [ ] Document any issues

---

## Ongoing (Monthly)

### Maintenance
- [ ] Review and optimize database queries
- [ ] Update dependencies
- [ ] Security patches applied
- [ ] Performance optimization
- [ ] Cost review and optimization

### Monitoring
- [ ] Review error trends
- [ ] Analyze performance metrics
- [ ] Review user analytics
- [ ] Check backup integrity
- [ ] Review security logs

---

## Emergency Procedures

### Rollback
1. [ ] Identify issue severity
2. [ ] Notify team
3. [ ] Execute rollback in Vercel dashboard
4. [ ] Verify rollback successful
5. [ ] Post-mortem meeting

### Incident Response
1. [ ] Assess impact
2. [ ] Notify stakeholders
3. [ ] Investigate root cause
4. [ ] Implement fix
5. [ ] Deploy fix
6. [ ] Document incident

---

## Quick Commands

### Deploy to Production
```bash
vercel --prod
```

### Check Health
```bash
curl https://your-domain.com/api/health
```

### View Logs
```bash
vercel logs
```

### Rollback
```bash
# In Vercel dashboard: Deployments > Previous deployment > Promote to Production
```

---

**Last Updated:** 2025-12-11

