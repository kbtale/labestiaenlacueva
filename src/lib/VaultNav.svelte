<script lang="ts">
  import { onMount } from 'svelte';
  import VaultRollLink from './VaultRollLink.svelte';
  import VaultCapsuleButton from './VaultCapsuleButton.svelte';
  import VaultKineticButton from './VaultKineticButton.svelte';
  import VaultDrawer from './VaultDrawer.svelte';
  import { getLang, translations, toggleLang } from './i18n.svelte';
  import type { ArchiveItem } from './VaultEngine';

  interface Props {
    activeFilter?: string | null;
    dist?: number;
    onFilterChange?: (filter: string | null) => void;
    onRewind?: () => void;
    onExplore?: () => void;
    onSelectVideo?: (video: ArchiveItem) => void;
    onModalChange?: (open: boolean) => void;
  }

  let {
    activeFilter = null,
    dist = 0,
    onRewind,
    onExplore,
    onSelectVideo,
    onModalChange
  }: Props = $props();

  let lang = $derived(getLang());
  let t = $derived(translations[lang]);

  let activeModal = $state<'about' | 'socials' | 'contact' | 'sections' | null>(null);
  let archiveItems = $state<ArchiveItem[]>([]);
  let selectedSection = $state<string>('Vídeos que Pondría en un Museo');
  let isDropdownMounted = $state(false);
  let isDropdownOpen = $state(false);
  let isCopiedEmail = $state(false);
  let githubStars = $state<number>(2);

  let contactName = $state('');
  let contactEmail = $state('');
  let contactSubject = $state('');
  let contactMessage = $state('');
  let contactStatus = $state<'idle' | 'sending' | 'success' | 'error'>('idle');

  const isAtRest = $derived(dist < 30);
  const starsLabel = $derived(`★ ${githubStars}`);

  const sectionKeys = [
    'Vídeos que Pondría en un Museo',
    'Vídeos de los que todos deberíamos estar hablando'
  ];

  let filteredVideos = $derived(
    archiveItems.filter(v => v.playlist === selectedSection)
  );

  async function handleSubmitContact(e: SubmitEvent) {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) return;

    contactStatus = 'sending';

    const accessKey = (import.meta as any).env?.VITE_WEB3FORMS_ACCESS_KEY || '';

    if (!accessKey) {
      const subject = contactSubject.trim() || (lang === 'es' ? 'Contacto desde la web' : 'Website inquiry');
      const body = encodeURIComponent(`De: ${contactName.trim()} <${contactEmail.trim()}>\n\n${contactMessage.trim()}`);
      window.location.href = `mailto:labestiaelc@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
      contactStatus = 'idle';
      return;
    }

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: contactName.trim(),
          email: contactEmail.trim(),
          subject: contactSubject.trim() || (lang === 'es' ? 'Mensaje desde la web' : 'Website inquiry'),
          message: contactMessage.trim(),
          from_name: 'La Bestia en la Cueva'
        })
      });
      const data = await res.json();
      if (data.success) {
        contactStatus = 'success';
        contactName = '';
        contactEmail = '';
        contactSubject = '';
        contactMessage = '';
        setTimeout(() => {
          contactStatus = 'idle';
        }, 5000);
      } else {
        throw new Error(data.message || 'Error');
      }
    } catch {
      contactStatus = 'error';
    }
  }

  $effect(() => {
    onModalChange?.(activeModal !== null);
  });

  onMount(async () => {
    try {
      const res = await fetch('/data/archive.json');
      const data = await res.json();
      archiveItems = data.entries || [];
    } catch {}

    try {
      const res = await fetch('https://api.github.com/repos/kbtale/labestiaenlacueva');
      if (res.ok) {
        const repoData = await res.json();
        if (typeof repoData.stargazers_count === 'number') {
          githubStars = repoData.stargazers_count;
        }
      }
    } catch {}
  });

  function pickVideo(video: ArchiveItem) {
    onSelectVideo?.(video);
  }

  function toggleDropdown() {
    if (!isDropdownMounted) {
      isDropdownMounted = true;
      requestAnimationFrame(() => {
        isDropdownOpen = true;
      });
    } else {
      closeDropdown();
    }
  }

  function closeDropdown() {
    if (!isDropdownMounted) return;
    isDropdownOpen = false;
    setTimeout(() => {
      isDropdownMounted = false;
    }, 280);
  }

  function selectSection(key: string) {
    selectedSection = key;
    closeDropdown();
  }

  async function handleCopyEmail() {
    try {
      await navigator.clipboard?.writeText('labestiaelc@gmail.com');
      isCopiedEmail = true;
      setTimeout(() => {
        isCopiedEmail = false;
      }, 2000);
    } catch {}
  }

  const socials = [
    {
      name: 'YouTube',
      handle: '@LaBestiaenlaCueva',
      url: 'https://www.youtube.com/@LaBestiaenlaCueva'
    },
    {
      name: 'GitHub',
      handle: 'kbtale',
      url: 'https://github.com/kbtale'
    },
    {
      name: 'Discord',
      handle: 'La Cueva / Términus',
      url: 'https://discord.gg/terminus'
    },
    {
      name: 'TikTok',
      handle: '@labestiaenlacueva',
      url: 'https://www.tiktok.com/@labestiaenlacueva'
    },
    {
      name: 'Kick',
      handle: 'bestiaelc',
      url: 'https://kick.com/bestiaelc'
    },
    {
      name: 'Threads',
      handle: '@carlosblacueva',
      url: 'https://www.threads.net/@carlosblacueva'
    }
  ];
</script>

<svelte:window
  onkeydown={(e) => {
    if (e.key === 'Escape' && isDropdownMounted) {
      closeDropdown();
      e.stopPropagation();
    }
  }}
  onclick={(e) => {
    if (isDropdownMounted) {
      const target = e.target as HTMLElement | null;
      if (!target?.closest('.vault-dropdown-container')) {
        closeDropdown();
      }
    }
  }}
/>

<header class="vault-nav-header fixed top-0 left-0 right-0 z-30 pointer-events-none p-3.5 sm:p-8 flex flex-col sm:flex-row items-center sm:justify-between min-h-[56px] sm:min-h-[80px]">
  <div
    class="w-full sm:w-auto flex items-center justify-start transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] {isAtRest ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 -translate-y-5 scale-[0.96] pointer-events-none'}"
  >
    <VaultCapsuleButton
      label={starsLabel}
      icon="github"
      href="https://github.com/kbtale/labestiaenlacueva"
      target="_blank"
      class="scale-90 origin-left sm:scale-100"
    />
  </div>

  <nav
    class="vault-brand-menu mt-2.5 sm:mt-0 flex items-center justify-center gap-3 sm:gap-9 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] {isAtRest ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 -translate-y-5 scale-[0.96] pointer-events-none'}"
  >
    <VaultRollLink label={t.nav.sections} onclick={() => activeModal = 'sections'} />
    <VaultRollLink label={t.nav.about} onclick={() => activeModal = 'about'} />
    <VaultRollLink label={t.nav.socials} onclick={() => activeModal = 'socials'} />
    <VaultRollLink label={t.nav.contact} onclick={() => activeModal = 'contact'} />
  </nav>

  <div
    class="w-full sm:w-[116px] flex items-center justify-end mt-2 sm:mt-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] {isAtRest ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 -translate-y-5 scale-[0.96] pointer-events-none'}"
  >
    <button
      type="button"
      onclick={() => toggleLang()}
      class="px-3 py-1 rounded-full bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border border-white/10 hover:border-white/25 font-ui text-[11px] font-semibold tracking-wider uppercase transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
      aria-label="Switch language"
    >
      {lang.toUpperCase()}
    </button>
  </div>
</header>

<div
  class="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] {isAtRest ? 'opacity-0 translate-y-12 pointer-events-none' : 'opacity-100 translate-y-0 pointer-events-auto'}"
>
  <VaultCapsuleButton
    label={t.nav.back}
    icon="rewind"
    onclick={onRewind}
    class="scale-90 sm:scale-100"
  />
</div>

{#snippet sectionsHeader()}
  <div class="relative vault-dropdown-container">
    <button
      type="button"
      onclick={toggleDropdown}
      class="vault-dropdown-trigger group relative flex items-center justify-between gap-3 h-10 sm:h-11 pl-5 pr-2 rounded-full bg-white text-black font-ui text-xs sm:text-sm font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer border-0"
      aria-haspopup="listbox"
      aria-expanded={isDropdownOpen}
    >
      <span class="max-w-[210px] sm:max-w-[320px] truncate select-none">
        {selectedSection}
      </span>
      <span class="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center shrink-0 transition-transform duration-300 {isDropdownOpen ? 'rotate-180' : ''}">
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </span>
    </button>

    {#if isDropdownMounted}
      <div
        class="absolute left-0 top-[calc(100%+8px)] w-72 sm:w-88 bg-[#0c0d12]/98 backdrop-blur-2xl rounded-2xl p-2 border border-white/15 shadow-2xl z-30 flex flex-col gap-1.5 transition-all duration-280 ease-[cubic-bezier(0.16,1,0.3,1)] {isDropdownOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}"
        role="listbox"
      >
        {#each sectionKeys as key}
          <button
            type="button"
            onclick={() => selectSection(key)}
            role="option"
            aria-selected={selectedSection === key}
            class="flex items-center justify-between px-4 py-2.5 rounded-xl text-left font-ui text-xs sm:text-sm transition-all duration-200 border-0 cursor-pointer {selectedSection === key ? 'bg-white text-black font-semibold' : 'text-neutral-300 hover:bg-white/10 hover:text-white font-medium'}"
          >
            <span class="truncate">{key}</span>
            <span class="font-ui text-xs {selectedSection === key ? 'text-black/60 font-semibold' : 'text-neutral-400'} shrink-0 ml-3">
              {archiveItems.filter(v => v.playlist === key).length} videos
            </span>
          </button>
        {/each}
      </div>
    {/if}
  </div>
{/snippet}

<VaultDrawer
  open={activeModal === 'sections'}
  maxWidth="max-w-2xl"
  onClose={() => { activeModal = null; closeDropdown(); }}
  onCloseStart={() => onModalChange?.(false)}
  header={sectionsHeader}
>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
    {#each filteredVideos as v}
      <button
        type="button"
        onclick={() => pickVideo(v)}
        class="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-left border border-white/5 hover:border-white/20 group cursor-pointer"
      >
        <img
          src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`}
          alt={v.title}
          class="w-20 h-13 object-cover rounded-md shrink-0 bg-black/50"
          loading="lazy"
        />
        <div class="flex flex-col min-w-0">
          <span class="font-ui text-xs font-medium text-white line-clamp-2 leading-snug group-hover:text-white">
            {v.title}
          </span>
          {#if v.tags && v.tags.length > 0}
            <span class="font-ui text-[10px] text-neutral-400 mt-1">
              #{v.tags[0]}
            </span>
          {/if}
        </div>
      </button>
    {/each}
  </div>
</VaultDrawer>

<VaultDrawer
  open={activeModal === 'about'}
  title={t.about.title}
  maxWidth="max-w-xl"
  onClose={() => activeModal = null}
  onCloseStart={() => onModalChange?.(false)}
>
  <div class="space-y-4 font-ui text-xs sm:text-sm text-neutral-300 leading-relaxed">
    <p class="font-body text-sm sm:text-base text-neutral-200 leading-relaxed">
      {t.about.p1}
    </p>
    <p class="font-body text-sm sm:text-base text-neutral-200 leading-relaxed">
      {t.about.p2}
    </p>
    <p class="font-body text-sm sm:text-base text-neutral-200 leading-relaxed">
      {t.about.p3}<a href="https://github.com/kbtale/labestiaenlacueva" target="_blank" rel="noopener noreferrer" class="text-white underline hover:text-white/80 transition-colors">{t.about.clickHere}</a>
    </p>
    <div class="pt-2 flex flex-wrap gap-4 items-center">
      <VaultCapsuleButton
        label={t.about.donateBtn}
        icon="external"
        href="https://ko-fi.com/U7U11S2E9Q"
        target="_blank"
      />
    </div>
  </div>
</VaultDrawer>

<VaultDrawer
  open={activeModal === 'socials'}
  title={t.socials.title}
  onClose={() => activeModal = null}
  onCloseStart={() => onModalChange?.(false)}
>
  <div class="flex flex-col gap-2.5 py-1">
    {#each socials as soc}
      <div class="flex items-center justify-between py-1">
        <VaultKineticButton
          label={`${soc.name} (${soc.handle})`}
          icon="external"
          href={soc.url}
          target="_blank"
        />
      </div>
    {/each}
  </div>
</VaultDrawer>

<VaultDrawer
  open={activeModal === 'contact'}
  title={t.contact.title}
  onClose={() => activeModal = null}
  onCloseStart={() => onModalChange?.(false)}
>
  <form
    onsubmit={handleSubmitContact}
    class="space-y-4 font-ui text-xs"
  >
    <div class="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5">
      <div>
        <div class="text-[10px] uppercase tracking-wider text-neutral-400 font-ui font-semibold">{t.contact.recipient}</div>
        <div class="text-white text-xs select-all font-medium mt-0.5">labestiaelc@gmail.com</div>
      </div>
      <VaultCapsuleButton
        label={isCopiedEmail ? t.contact.copied : t.contact.copyEmail}
        icon="copy"
        onclick={handleCopyEmail}
      />
    </div>

    {#if contactStatus === 'success'}
      <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-3">
        <svg class="w-4 h-4 shrink-0 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>{t.contact.sentSuccess}</span>
      </div>
    {:else}
      {#if contactStatus === 'error'}
        <div class="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex flex-col gap-2">
          <span>{t.contact.sendError} <a href="mailto:labestiaelc@gmail.com" class="text-white underline">labestiaelc@gmail.com</a>.</span>
        </div>
      {/if}

      <div class="space-y-1.5">
        <label for="contact-name" class="text-[11px] text-neutral-400 uppercase tracking-wider font-medium">{t.contact.nameLabel}</label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          bind:value={contactName}
          placeholder={t.contact.namePlaceholder}
          class="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-white/30 transition-colors"
        />
      </div>

      <div class="space-y-1.5">
        <label for="contact-email" class="text-[11px] text-neutral-400 uppercase tracking-wider font-medium">{t.contact.emailLabel}</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          bind:value={contactEmail}
          placeholder={t.contact.emailPlaceholder}
          class="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-white/30 transition-colors"
        />
      </div>

      <div class="space-y-1.5">
        <label for="contact-subject" class="text-[11px] text-neutral-400 uppercase tracking-wider font-medium">{t.contact.subjectLabel}</label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          bind:value={contactSubject}
          placeholder={t.contact.subjectPlaceholder}
          class="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-white/30 transition-colors"
        />
      </div>

      <div class="space-y-1.5">
        <label for="contact-message" class="text-[11px] text-neutral-400 uppercase tracking-wider font-medium">{t.contact.messageLabel}</label>
        <textarea
          id="contact-message"
          name="message"
          rows="4"
          required
          bind:value={contactMessage}
          placeholder={t.contact.messagePlaceholder}
          class="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-white/30 transition-colors resize-none"
        ></textarea>
      </div>

      <div class="pt-2 flex justify-end">
        <VaultCapsuleButton
          type="submit"
          label={contactStatus === 'sending' ? t.contact.sendingBtn : t.contact.sendBtn}
          icon="arrow-right"
        />
      </div>
    {/if}
  </form>
</VaultDrawer>
