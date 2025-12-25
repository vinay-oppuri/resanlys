import { HydrationBoundary } from "@tanstack/react-query"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { HomeView, HomeViewError, HomeViewLoading } from "../modules/home/ui/views/home-view"

const Home = () => {
    return (
        <HydrationBoundary state={null}>
          <Suspense fallback={<HomeViewLoading />}>
            <ErrorBoundary fallback={<HomeViewError />}>
              <HomeView />
            </ErrorBoundary>
          </Suspense>
        </HydrationBoundary>
    )
}
export default Home
