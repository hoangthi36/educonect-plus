export function toSafeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.emailNormalized,
    role: user.role,
    accountStatus: user.accountStatus,
    profile: {
      phone: user.profile?.phone ?? '',
      location: user.profile?.location ?? '',
      headline: user.profile?.headline ?? '',
      subjects: user.profile?.subjects ?? [],
      verificationStatus: user.profile?.verificationStatus ?? 'unverified',
    },
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}
