<script lang="ts">
  import { Mail, Send, Check, Copy } from 'lucide-svelte';
  import { getLang, translations } from './i18n.svelte';
  import { siteConfig } from './config';

  let lang = $derived(getLang());
  let t = $derived(translations[lang]);

  let emailCopied = $state(false);
  let name = $state('');
  let email = $state('');
  let message = $state('');
  let sentStatus = $state(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(siteConfig.officialEmail);
    emailCopied = true;
    setTimeout(() => emailCopied = false, 2000);
  };

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    sentStatus = true;
    setTimeout(() => {
      name = '';
      email = '';
      message = '';
      sentStatus = false;
    }, 3000);
  };
</script>

<section id="contact" class="py-20 px-6 sm:px-12 border-b border-mono-200 dark:border-mono-800">
  <div class="max-w-6xl mx-auto">
    <div class="mb-12">
      <h2 class="text-3xl sm:text-4xl font-bold tracking-tight text-mono-950 dark:text-mono-50">
        {t.contact.title}
      </h2>
    </div>

    <div class="border border-mono-200 dark:border-mono-800 bg-mono-50/40 dark:bg-mono-900/30 p-6 sm:p-12">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div class="lg:col-span-5 flex flex-col justify-between">
          <div>
            <h3 class="text-xl sm:text-2xl font-bold text-mono-950 dark:text-mono-50 tracking-tight">
              {t.contact.directTitle}
            </h3>

            <div class="mt-8 p-4 border border-mono-200 dark:border-mono-800 bg-white dark:bg-mono-950 flex items-center justify-between">
              <div class="flex items-center gap-3 overflow-hidden">
                <div class="w-8 h-8 border border-mono-200 dark:border-mono-800 bg-mono-50 dark:bg-mono-900 flex items-center justify-center text-mono-700 dark:text-mono-300 shrink-0">
                  <Mail class="w-4 h-4 stroke-[1.75]" />
                </div>
                <div class="truncate">
                  <span class="text-[10px] text-mono-500 font-mono uppercase tracking-wider block">{t.contact.emailLabel}</span>
                  <span class="text-xs text-mono-950 dark:text-mono-50 font-mono truncate block font-semibold">{siteConfig.officialEmail}</span>
                </div>
              </div>

              <button
                onclick={copyEmail}
                class="p-2 border border-mono-300 dark:border-mono-800 bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 hover:border-mono-950 dark:hover:border-mono-50 transition-colors shrink-0 ml-2 text-xs font-semibold"
                title={t.contact.copy}
              >
                {#if emailCopied}
                  <Check class="w-3.5 h-3.5 text-mono-950 dark:text-mono-50" />
                {:else}
                  <Copy class="w-3.5 h-3.5 stroke-[1.75]" />
                {/if}
              </button>
            </div>
          </div>

          <div class="mt-10 pt-6 border-t border-mono-200 dark:border-mono-800 text-xs text-mono-500 font-mono">
            <span>{t.contact.responseTime}</span>
          </div>
        </div>

        <div class="lg:col-span-7">
          <form onsubmit={handleSubmit} class="flex flex-col gap-4">
            <div>
              <label for="contact-name" class="block text-xs font-mono uppercase tracking-wider font-semibold text-mono-950 dark:text-mono-50 mb-2">{t.contact.nameLabel}</label>
              <input
                id="contact-name"
                type="text"
                bind:value={name}
                required
                placeholder={t.contact.namePlaceholder}
                class="w-full bg-white dark:bg-mono-950 border border-mono-300 dark:border-mono-800 px-4 py-3 text-sm text-mono-950 dark:text-mono-50 placeholder-mono-400 focus:outline-none focus:border-mono-950 dark:focus:border-mono-50 transition-colors"
              />
            </div>

            <div>
              <label for="contact-email" class="block text-xs font-mono uppercase tracking-wider font-semibold text-mono-950 dark:text-mono-50 mb-2">{t.contact.emailInputLabel}</label>
              <input
                id="contact-email"
                type="email"
                bind:value={email}
                required
                placeholder={t.contact.emailInputPlaceholder}
                class="w-full bg-white dark:bg-mono-950 border border-mono-300 dark:border-mono-800 px-4 py-3 text-sm text-mono-950 dark:text-mono-50 placeholder-mono-400 focus:outline-none focus:border-mono-950 dark:focus:border-mono-50 transition-colors"
              />
            </div>

            <div>
              <label for="contact-message" class="block text-xs font-mono uppercase tracking-wider font-semibold text-mono-950 dark:text-mono-50 mb-2">{t.contact.messageLabel}</label>
              <textarea
                id="contact-message"
                bind:value={message}
                required
                rows="4"
                placeholder={t.contact.messagePlaceholder}
                class="w-full bg-white dark:bg-mono-950 border border-mono-300 dark:border-mono-800 px-4 py-3 text-sm text-mono-950 dark:text-mono-50 placeholder-mono-400 focus:outline-none focus:border-mono-950 dark:focus:border-mono-50 transition-colors resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={sentStatus}
              class="mt-2 inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 bg-mono-950 text-mono-50 dark:bg-mono-50 dark:text-mono-950 font-mono text-xs uppercase tracking-wider font-semibold hover:bg-mono-800 dark:hover:bg-mono-200 transition-colors disabled:opacity-50"
            >
              {#if sentStatus}
                <Check class="w-3.5 h-3.5" />
                <span>{t.contact.btnSent}</span>
              {:else}
                <span>{t.contact.btnSend}</span>
                <Send class="w-3.5 h-3.5 stroke-[1.75]" />
              {/if}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>
