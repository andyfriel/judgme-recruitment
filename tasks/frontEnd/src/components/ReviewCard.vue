<template>
  <Card style="margin-bottom: 25px;" v-if="displayAd">
    <BlockStack gap="100" inlineAlign="start">
      <Badge v-if="reviewObject.review.verifiedPurchase" size="large" tone="success">Verified</Badge>
      <InlineStack v-else gap="200">
        <Badge size="large" tone="critical">Unverified</Badge>
        <Button @click="$emit('verifyReview')">Verify Review</button>
      </InlineStack>
      <Text as="h2" variant="headingXl">{{ reviewObject.productName }} - {{ reviewObject.shopName }}</Text>
      <Text as="h3" variant="headingLg">{{ reviewObject.reviewer.name }} - {{  reviewObject.reviewer.email }}</Text>
      <Text>{{ reviewObject.review.reviewBody }}</Text>
      <InlineStack gap="200">
        <Thumbnail v-for="reviewImage in reviewObject.review.reviewImages" :source="reviewImage" />
      </InlineStack>
      <Badge size="large" :icon="StarFilledIcon">{{ reviewObject.review.rating }}</Badge>
      <Divider />
      <Button variant="plain" tone="critical" @click="$emit('removeReview')" >
        Remove
      </Button>
    </BlockStack>
  </Card>
</template>

<script setup>
import { ref, watch } from 'vue';
import StarFilledIcon from '@shopify/polaris-icons/dist/svg/StarFilledIcon.svg';

const props = defineProps({
  reviewObject: {
    type: [Object, null],
    required: true
  },
  unverifiedOnly: {
    type: [Boolean, false],
    required: true
  }
})

const displayAd = ref(true);

watch(() => props.unverifiedOnly, () => {
  displayAd.value = props.unverifiedOnly && props.reviewObject.review.verifiedPurchase ? false : true;
})
</script>
