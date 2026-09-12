import AdminPageHeader from "@/app/components/admin/AdminPageHeader";
import { getCurrentUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";

import AdvertisingAnalytics from "./components/AdvertisingAnalytics";
import AIInsights from "./components/AIInsights";
import AnalyticsOverview from "./components/AnalyticsOverview";
import AnalyticsTabs from "./components/AnalyticsTabs";
import AudienceAnalytics from "./components/AudienceAnalytics";
import EditorialAnalytics from "./components/EditorialAnalytics";
import LiveActivity from "./components/LiveActivity";
import RevenueAnalytics from "./components/RevenueAnalytics";

import { buildAnalyticsMetrics } from "./lib/analyticsMetrics";
import { getAnalyticsDashboard } from "./lib/analyticsRepository";

export default async function AdminAnalyticsPage() {
  const user =
    await getCurrentUser();

  if (
    !user ||
    user.role !== "admin"
  ) {
    redirect("/login");
  }

  const analyticsData =
    await getAnalyticsDashboard();

  const metrics =
    buildAnalyticsMetrics(
      analyticsData
    );

  return (
    <main className="space-y-6">
      <AdminPageHeader
        eyebrow="SourceTV Analytics"
        title="Platform performance"
        description="Track audience behavior, catalog health, ad delivery, partner activity, and revenue signals across SourceTV."
      />

      <AnalyticsTabs
        overview={
          <AnalyticsOverview
            {...metrics.overview}
          />
        }
        editorial={
          <EditorialAnalytics
            {...metrics.editorial}
          />
        }
        audience={
          <AudienceAnalytics
            {...metrics.audience}
          />
        }
        advertising={
          <AdvertisingAnalytics
            {...metrics.advertising}
          />
        }
        revenue={
          <RevenueAnalytics
            {...metrics.revenue}
          />
        }
        activity={
          <LiveActivity
            {...metrics.activity}
          />
        }
        ai={
          <AIInsights
            {...metrics.ai}
          />
        }
      />
    </main>
  );
}