<template>
  <AppProvider>
    <Page title="Judge.Me Reviews">
      <Layout>
        <LayoutSection>
          <Button @click="toggleCollapsibleActive" style="margin-bottom: 20px;">{{ formButtonMessage }}</Button>
          <Collapsible :open="collapsibleActive" :class="{ collapsibleActive: collapsibleActive }">
            <Card>
              <ReviewForm @add-review="addReview" :key="formReset" />
            </Card>
          </Collapsible>
          <Checkbox label="Unverified reviews only" v-model="unverifiedOnly" />
          <Divider />
          <EmptyState
            v-if="!reviews || reviews.length < 1"
            heading="No reviews found">
            <Text as="p">Add a review above or reload the page</Text>
          </EmptyState>
          <ReviewCard
            v-for="(review, index) in reviews"
            :key="review.id"
            :reviewObject="review"
            :unverifiedOnly="unverifiedOnly"
            @remove-review="removeReview(review.id, index)"
            @verify-review="verifyReview(review.id, index)"
          />
        </LayoutSection>
      </Layout>
    </Page>
  </AppProvider>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import ReviewCard from './components/ReviewCard.vue';
import ReviewForm from './components/ReviewForm.vue';

const reviews = ref(null);
const collapsibleActive = ref(false);
const formButtonMessage = ref('Add new review');
const unverifiedOnly = ref(false);
const formReset = ref(0);

const toggleCollapsibleActive = () => {
  collapsibleActive.value = !collapsibleActive.value;
  collapsibleActive.value ? formButtonMessage.value = 'Hide form' : formButtonMessage.value = 'Add a new review';
};

const fetchReviews = () => {
  const url = new URL('https://663e3cbae1913c47679705a2.mockapi.io/api/v1/reviews');
  url.searchParams.append('sortBy', 'createdAt');
  url.searchParams.append('order', 'desc');

  fetch(url)
    .then(response => response.json())
    .then(data => reviews.value = data)
}

const addReview = () => {
  fetchReviews();
  toggleCollapsibleActive();
  formReset.value += 1;
}

const removeReview = (id, index) => {
  fetch('https://663e3cbae1913c47679705a2.mockapi.io/api/v1/reviews/' + id, { method: 'DELETE' })
    .then(() => reviews.value.splice(index, 1));
}

const verifyReview = (id, index) => {
  const updatedReview = {...reviews.value[index], review: {...reviews.value[index].review, verifiedPurchase: true} };
  const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedReview)
  };
  fetch('https://663e3cbae1913c47679705a2.mockapi.io/api/v1/reviews/' + id, requestOptions )
    .then(() => reviews.value[index].review.verifiedPurchase = true);
}

onMounted(() => fetchReviews());
</script>

<style scoped>
.collapsibleActive {
  margin-bottom: 20px;
  max-height: none !important;
}
</style>
